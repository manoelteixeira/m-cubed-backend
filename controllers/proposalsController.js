const express = require("express");
const proposals = express.Router({ mergeParams: true });
const { getLender } = require("../queries/lenders");

// Importing queries from loan proposals
const {
  getAllLoanProposalsByLenderID,
  getProposalByID,
  getProposalsByRequestID,
  createProposalFromRequest,
  updateProposalByID,
  deleteProposalByID,
} = require("../queries/proposals");

// INDEX - Get all proposals made by a specific lender
// URL: GET /lenders/:lender_id/proposals
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

// SHOW - Get a single proposal by proposal ID
// URL: GET /lenders/:lender_id/proposals/:proposal_id
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

// CREATE - Create a new proposal from a loan request
// URL: POST /lenders/:lender_id/proposals
proposals.post("/", async (req, res) => {
  const { lender_id } = req.params;
  const { request_id, title, description } = req.body;
  try {
    const newProposal = await createProposalFromRequest(lender_id, request_id, {
      title,
      description,
    });
    res.status(201).json(newProposal);
  } catch (error) {
    console.error("Error creating loan proposal:", error);
    res.status(400).json({ error: "Invalid data provided" });
  }
});

// UPDATE - Update a proposal by proposal ID
// URL: PUT /lenders/:lender_id/proposals/:proposal_id
proposals.put("/:proposal_id", async (req, res) => {
  const { lender_id, proposal_id } = req.params;
  const { title, description, accepted } = req.body;
  try {
    const updatedProposal = await updateProposalByID(lender_id, proposal_id, {
      title,
      description,
      accepted,
    });
    if (updatedProposal) {
      res.status(200).json(updatedProposal);
    } else {
      res.status(404).json({ error: "Proposal not found" });
    }
  } catch (error) {
    console.error(
      `Error updating loan proposal with ID ${proposal_id} for lender ${lender_id}:`,
      error
    );
    res.status(400).json({ error: "Invalid data provided" });
  }
});

// DELETE - Delete a proposal by ID
// URL: DELETE /lenders/:lender_id/proposals/:proposal_id
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

// SHOW - Get all proposals by loan request ID (since no borrower_id in schema)
// URL: GET /requests/:request_id/proposals
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
