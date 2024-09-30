const express = require("express");
const requests = express.Router({ mergeParams: true });
const {
  getAllLoanRequests,
  getAllLoanRequestsByLenderID,
  getLoanRequestByID,
  createLoanRequest,
  createProposal,
} = require("../queries/lendersRequestsQueries");

const {
  validateTitle,
  validateDescription,
  validateCreatedAt,
} = require("../validators/lendersProposalsValidators");

/**
 * Get all loan requests (no filter)
 * localhost:4001/lenders/:lender_id/requests/
 */
requests.get("/", async (req, res) => {
  try {
    const loanRequests = await getAllLoanRequests();
    console.log(loanRequests);
    res.status(200).json(loanRequests);
  } catch (error) {
    console.error("Error fetching all loan requests:", error);
    res.status(500).json({ error: "Failed to fetch loan requests" });
  }
});

/**
 * Get a single loan request by loan_request_id
 * localhost:4001/lenders/:lender_id/requests/:id
 */
requests.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const loanRequest = await getLoanRequestByID(id);
    if (loanRequest) {
      res.status(200).json(loanRequest);
    } else {
      res.status(404).json({ error: "Loan request not found" });
    }
  } catch (error) {
    console.error("Error fetching loan request by ID:", error);
    res.status(500).json({ error: "Failed to fetch loan request" });
  }
});

/**
 * Create a loan request proposal
 * localhost:4001/lenders/:lender_id/requests/:id
 */
requests.post(
  "/:id",
  validateTitle,
  validateDescription,
  validateCreatedAt,
  async (req, res) => {
    const { lender_id, id } = req.params;
    const proposal = req.body;
    proposal.loan_request_id = Number(id);
    proposal.lender_id = Number(lender_id);
    try {
      const newProposal = await createProposal(proposal);
      if (newProposal.id) {
        res.status(200).json(newProposal);
      } else {
        console.error(newProposal);
        res.status(400).json({ error: "Someting went wrong! (°_o)" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = requests;
