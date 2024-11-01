// src/controllers/borrowersRequestProposalsController.js
/**
 * @swagger
 * tags:
 *   name: Borrower Request Proposals
 *   description: Operations related to loan requests made by a given borrower.
 */

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

/** List All Proposals
 * @swagger
 * /borrowers/{borrower_id}/requests/{request_id}/proposals:
 *   get:
 *     tags:
 *       - Borrower Request Proposals
 *     summary: List All Proposals
 *     parameters:
 *       - name: borrower_id
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *       - name: request_id
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json: {}
 */
requestProposalsController.get("/", async (req, res) => {
  const { request_id } = req.params;
  try {
    const proposals = await getProposals(request_id);
    if (Array.isArray(proposals)) {
      res.status(200).json(proposals);
    } else {
      res
        .status(404)
        .json({ error: "Proposal not found", message: proposals.error });
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

/** Get One Loan Proposal
 * @swagger
 * /borrowers/{borrower_id}/requests/{request_id}/proposals/{id}:
 *   get:
 *     tags:
 *       - Borrower Request Proposals
 *     summary: Get One Loan Proposal
 *     parameters:
 *       - name: borrower_id
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *       - name: request_id
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *       - name: id
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json: {}
 */
requestProposalsController.get("/:id", async (req, res) => {
  const { request_id, id } = req.params;
  try {
    const proposal = await getProposal(request_id, id);
    if (proposal.id) {
      res.status(200).json(proposal);
    } else {
      res.status(404).json({ error: "Proposal not found." });
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

/** Accept proposal
 * @swagger
 * /borrowers/{borrower_id}/requests/{request_id}/proposals/:
 *   put:
 *     tags:
 *       - Borrower Request Proposals
 *     summary: Accept proposal
 *     description: Accept one proposal and deny the others. Loans request and Loan proposals cannot be eddited after this.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               proposal_id: <proposal id>
 *     parameters:
 *       - name: borrower_id
 *         in: path
 *         schema:
 *           type:
 *         required: true
 *       - name: request_id
 *         in: path
 *         schema:
 *           type:
 *         required: true
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json: {}
 */

requestProposalsController.put("/", validateProposalID, async (req, res) => {
  const { borrower_id, request_id } = req.params;
  const { proposal_id } = req.body;

  try {
    const data = await acceptProposal(borrower_id, request_id, proposal_id);
    res.status(200).json(data);
  } catch (err) {
    res.status(400).send("something went wrong.");
  }
});

module.exports = requestProposalsController;
