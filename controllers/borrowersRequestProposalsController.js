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

/** List All Proposals
 * @swagger
 * /borrowers/{borrower_id}/requests/{request_id}/proposals:
 *   get:
 *     tags:
 *       - [Borrower Request Proposals]
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
 *           type: trung
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
    res.status(200).json(proposals);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

/** Get One Loan Proposal
 * @swagger
 * /borrowers/{borrower_id}/requests/{request_id}/proposals/{id}:
 *   get:
 *     tags:
 *       - [Borrower Request Proposals]
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
 *       - [Borrower Request Proposals]
 *     summary: Accept proposal
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               proposal_id: 2
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

requestProposalsController.put("/", validateProposalID, async (req, res) => {
  const { borrower_id, request_id } = req.params;
  const { proposal_id } = req.body;

  const data = await acceptProposal(+borrower_id, +request_id, proposal_id);
  res.status(200).json(data);
});

module.exports = requestProposalsController;
