// controllers/lendersProposalsController.js
/**
 * @swagger
 * tags:
 *   name: Lender Proposals
 *   description: Operations related to loan proposals made by a given lender.
 */

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

/** List All Proposals Made By the Lender
 * @swagger
 * /lenders/{lender_id}/proposals:
 *  get:
 *    tags:
 *      - Lender Proposals
 *    summary: List All Proposals Made By the Lender
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Lender ID
 *    responses:
 *      '200':
 *        description: Successful response
 *        content:
 *          application/json: {}
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

/** Get One Proposal
 * @swagger
 * /lenders/{lender_id}/proposals/{id}:
 *     get:
 *       tags:
 *         - Lender Proposals
 *       summary: Get One Proposal
 *       parameters:
 *         - in: path
 *           name: lender_id
 *           schema:
 *             type: string
 *           required: true
 *           description: Lender ID
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: Proposal ID
 *       responses:
 *         '200':
 *           description: Successful response
 *           content:
 *             application/json: {}
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

/** Update Proposal
 * @swagger
 * /lenders/{lender_id}/proposals/{id}:
 *  put:
 *        tags:
 *          - Lender Proposals
 *        summary: Update Proposal
 *        parameters:
 *          - in: path
 *            name: lender_id
 *            schema:
 *              type: string
 *            required: true
 *            description: Lender ID
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Proposal ID
 *        requestBody:
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *              example:
 *               title: Low-Interest P222roposal
 *               description: Offering a low-interest loan with flexible repayment options.
 *               loan_amount: 50000
 *               interest_rate: 5
 *               repayment_term: 36
 *               created_at: '2023-01-20T05:00:00.000Z'
 *        responses:
 *          '200':
 *            description: Successful response
 *            content:
 *              application/json: {}
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

    try {
      const proposal = await updateProposalByID({
        ...req.body,
        lender_id,
        id,
      });
      console.error(proposal);
      if (proposal.id) {
        res.status(200).json(proposal);
      } else if (proposal.error == "Loan proposal can no longer be updated.") {
        res.status(403).json({ error: proposal.error });
      } else {
        res.status(404).json({ error: "Request not found." });
      }
    } catch (err) {
      res.status(400).send(err);
    }
  }
);

/** Delete Proposal
 * @swagger
 * /lenders/{lender_id}/proposals/{id}:
 *   delete:
 *        tags:
 *          - Lender Proposals
 *        summary: Delete Proposal
 *        parameters:
 *          - in: path
 *            name: lender_id
 *            schema:
 *              type: string
 *            required: true
 *            description: Lender ID
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Proposal ID
 *        responses:
 *          '200':
 *            description: Successful response
 *            content:
 *              application/json: {}
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
 *           type: string
 *           description: Loan Proposal Lender ID
 *         loan_request_id:
 *           type: string
 *           description: Loan Proposal Request ID
 *       example:
 *          id: 082d54ef-635d-4ba3-b945-8b6780851d61,
 *          title: Low-Interest Proposal,
 *          description: Offering a low-interest loan with flexible repayment options.,
 *          loan_amount: 50000.00,
 *          interest_rate: 5.00,
 *          repayment_term: 36,
 *          created_at: 2023-01-20T05:00:00.000Z,
 *          accepted: false,
 *          lender_id: 082d54ef-635d-4ba3-b945-8b6780851d62,
 *          loan_request_id: 082d54ef-635d-4ba3-b945-8b6780851d6g

 */
