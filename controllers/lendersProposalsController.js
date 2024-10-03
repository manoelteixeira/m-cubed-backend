const express = require("express");
const proposals = express.Router({ mergeParams: true });
const { getLender } = require("../queries/lendersQueries");

// Importing validators
const {
  validateTitle,
  validateDescription,
  validateCreatedAt,
  validateLoanAmount,
  validateInterestRate,
  validateRepaymentTerm,
} = require("../validators/lendersProposalsValidators");

// Importing queries from loan proposals
const {
  getAllLoanProposalsByLenderID,
  getProposalByID,
  getProposalsByRequestID,
  updateProposalByID,
  deleteProposalByID,
} = require("../queries/lendersProposalsQueries");

/**
 * INDEX - Get all proposals made by a specific lender
 * http://localhost:400/lenders/:lender_id/proposals
 */
proposals.get("/", async (req, res) => {
  const { lender_id } = req.params;
  try {
    const proposalsByLender = await getAllLoanProposalsByLenderID(lender_id);
    if (proposalsByLender.length > 0) {
      res.status(200).json(proposalsByLender);
    } else {
      res.status(404).json({ error: "No proposals found for this lender" });
    }
  } catch (error) {
    console.error("Error fetching loan proposals:", error);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * SHOW - Get a single proposal by proposal ID
 * http://localhost:400/lenders/:lender_id/proposals/:id
 */
proposals.get("/:proposal_id", async (req, res) => {
  const { lender_id, proposal_id } = req.params;
  try {
    const proposal = await getProposalByID(lender_id, proposal_id);
    if (proposal) {
      res.status(200).json(proposal);
    } else {
      res.status(404).json({ error: "Proposal not found" });
    }
  } catch (error) {
    console.error(
      `Error fetching loan proposal with ID ${proposal_id} for lender ${lender_id}:`,
      error
    );
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * UPDATE - Update a proposal by proposal ID
 * http://localhost:400/lenders/:lender_id/proposals/:id
 */
proposals.put(
  "/:id",
  validateTitle,
  validateDescription,
  validateTitle,
  validateDescription,
  validateCreatedAt,
  validateLoanAmount,
  validateInterestRate,
  validateRepaymentTerm,
  async (req, res) => {
    const { lender_id, id } = req.params;
    const proposal = req.body;
    proposal.id = Number(id);
    proposal.lender_id = Number(lender_id);
    console.log(proposal);
    try {
      const updatedProposal = await updateProposalByID(proposal);
      console.log(updatedProposal);
      if (updatedProposal.id) {
        res.status(200).json(updatedProposal);
      } else {
        res.status(400).json({ error: "Someting went wrong! (°_o)" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/*
 * DELETE - Delete a proposal by ID
 * http://localhost:400/lenders/:lender_id/proposals/:id
 */
proposals.delete("/:proposal_id", async (req, res) => {
  const { lender_id, proposal_id } = req.params;
  try {
    const deletedProposal = await deleteProposalByID(lender_id, proposal_id);
    if (deletedProposal) {
      res.status(200).json(deletedProposal);
    } else {
      res.status(404).json({ error: "Proposal not found" });
    }
  } catch (error) {
    console.error(
      `Error deleting loan proposal with ID ${proposal_id} for lender ${lender_id}:`,
      error
    );
    res.status(500).json({ error: "Server error" });
  }
});

// SHOW - Get all proposals by loan request ID
proposals.get("/requests/:request_id", async (req, res) => {
  const { request_id } = req.params;
  try {
    const proposalsByRequest = await getProposalsByRequestID(request_id);
    if (proposalsByRequest.length > 0) {
      res.status(200).json(proposalsByRequest);
    } else {
      res
        .status(404)
        .json({ error: "No proposals found for this loan request" });
    }
  } catch (error) {
    console.error("Error fetching proposals by loan request:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = proposals;

/**
 * @swagger
 * components:
 *   schemas:
 *     Loan Proposal:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - description
 *         - loan_amount
 *         - interest_rate
 *         - repayment_term
 *         - created_at
 *         - accepted
 *         - lender_id
 *         - loan_request_id
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the loan proposal
 *         title:
 *           type: string
 *           description: Loan Proposal Title
 *         description:
 *           type: string
 *           description: Loan Proposal Description
 *         loan_amount:
 *           type: number
 *           description: Loan Proposal Amount
 *         interest_rate:
 *           type: number
 *           description: Loan Proposal Interest Rate
 *         repayment_term:
 *           type: number
 *           description: Loan Proposal Repayment Term (In months)
 *         created_at:
 *           type: string
 *           format: date
 *           description: Loan Proposal Creation Date
 *         accepted:
 *           type: boolen
 *           description: Loan Proposal Accepted Status
 *         lender_id:
 *           type: number
 *           description: Loan Proposal Lender ID
 *         loan_request_id:
 *           type: number
 *           description: Loan Proposal Request ID
 *       example:
 *          id: 1,
 *          title: Low-Interest Proposal,
 *          description: Offering a low-interest loan with flexible repayment options.,
 *          loan_amount: 50000.00,
 *          interest_rate: 5.00,
 *          repayment_term: 36,
 *          created_at: 2023-01-20T05:00:00.000Z,
 *          accepted: false,
 *          lender_id: 1,
 *          loan_request_id: 1

 */
