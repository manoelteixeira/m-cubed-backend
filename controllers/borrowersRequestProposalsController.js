// controllers/requestProposalsController.js
/* Dependencies */
const express = require("express");
const {
  getProposals,
  getProposal,
  acceptProposal,
} = require("../queries/borrowersRequestProposalsQueries");

const {
  validateProposalID,
} = require("../validators/borrowersRequestProposalsValidators");

/* Configurations */
const requestProposalsController = express.Router({ mergeParams: true });

/* Routes */
/**
 * GET all proposals for a given loan request
 * ROUTE: localhost:4001/:borrower_id/requests/:request_id/proposals
 */
requestProposalsController.get("/", async (req, res) => {
  const { request_id } = req.params;
  try {
    const proposals = await getProposals(Number(request_id));
    res.status(200).json(proposals);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

/**
 * Accept a specific proposal
 * ROUTE: localhost:4001/:borrower_id/requests/:request_id/proposals/
 */
requestProposalsController.put("/", validateProposalID, async (req, res) => {
  const { borrower_id, request_id } = req.params;
  const { proposal_id } = req.body;

  const data = await acceptProposal(+borrower_id, +request_id, proposal_id);
  res.status(200).json(data);
});

/**
 * GET a especific proposal for a given loan request
 * ROUTE: localhost:4001/:borrower_id/requests/:request_id/proposals/:id
 */
requestProposalsController.get("/:id", async (req, res) => {
  const { request_id, id } = req.params;
  try {
    const proposal = await getProposal(Number(request_id), Number(id));
    if (proposal.id) {
      res.status(200).json(proposal);
    } else {
      res.status(404).json({ error: "Proposal not found." });
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

module.exports = requestProposalsController;
