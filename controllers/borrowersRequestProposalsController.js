// controllers/requestProposalsController.js
/* Dependencies */
const express = require("express");
const { getProposals } = require("../queries/borrowersRequestProposalsQueries");

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

module.exports = requestProposalsController;
