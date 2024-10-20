// src/controllers/borrowersRequestsController.js
/**
 * @swagger
 * tags:
 *   name: Borrower Requests
 *   description: Operations related to the loan requests for a given borrower.
 */
/* Dependencies */
const express = require("express");
const {
  getRequest,
  getRequests,
  deleteRequest,
  createRequest,
  updateRequest,
} = require("../queries/borrowersRequestsQueries");

const {
  validateTitle,
  validateDescription,
  validateValue,
  validateCreatedAt,
  validateExpireAt,
} = require("../validators/borrowersRequestsValidators");

const requestProposalsController = require("./borrowersRequestProposalsController");

/* Configurations */
const requestsController = express.Router({ mergeParams: true });
requestsController.use("/:request_id/proposals", requestProposalsController);

/* Routes */

/** List All Borrower Requests
 * @swagger
 * /borrowers/{borrower_id}/requests:
 *   get:
 *     tags:
 *       - Borrower Requests
 *     summary: List All Loan Requests
 *     parameters:
 *       - name: borrower_id
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: Successful response
 *       '500':
 *         description: Internal server error
 */
requestsController.get("/", async (req, res) => {
  const { borrower_id } = req.params;
  try {
    const requests = await getRequests(borrower_id);
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

/** Create New Loan Request
 * @swagger
 * /borrowers/{borrower_id}/requests:
 *   post:
 *     tags:
 *       - Borrower Requests
 *     summary: Create New Loan Request
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               title: Test Loan
 *               description: Test
 *               value: 50000
 *               created_at: '2023-01-15T05:00:00.000Z'
 *               expire_at: '2023-02-15T05:00:00.000Z'
 *     parameters:
 *       - name: borrower_id
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
requestsController.post(
  "/",
  validateTitle,
  validateDescription,
  validateValue,
  validateCreatedAt,
  validateExpireAt,
  async (req, res) => {
    const { borrower_id } = req.params;
    try {
      const request = await createRequest({
        ...req.body,
        borrower_id: borrower_id,
      });

      if (request.id) {
        res.status(200).json(request);
      } else {
        console.log(request);
        res.status(400).json(request);
      }
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error." });
    }
  }
);

/** Get One Loan Request
 * @swagger
 * /borrowers/{borrower_id}/requests/{id}:
 *   get:
 *     tags:
 *       - Borrower Requests
 *     summary: Get One Loan Request
 *     parameters:
 *       - name: borrower_id
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
requestsController.get("/:id", async (req, res) => {
  const { borrower_id, id } = req.params;
  try {
    const request = await getRequest(borrower_id, id);
    if (request.id) {
      res.status(200).json(request);
    } else {
      res.status(404).json({ error: "Request not found." });
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

/** Update Loan Request
 * @swagger
 * /borrowers/{borrower_id}/requests/{id}:
 *   put:
 *     tags:
 *       - Borrower Requests
 *     summary: Update Loan Request
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               title: Update Test Loan Update
 *               description: Test
 *               value: 50000
 *     parameters:
 *       - name: borrower_id
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
requestsController.put(
  "/:id",
  validateTitle,
  validateDescription,
  validateValue,
  async (req, res) => {
    const { borrower_id, id } = req.params;
    try {
      const request = await updateRequest({
        ...req.body,
        borrower_id: borrower_id,
        id: id,
      });
      console.log(request);
      if (request.id) {
        res.status(200).json(request);
      } else if (request.error == "Loan request can no longer be updated.") {
        res.status(403).json({ error: request.error });
      } else {
        res.status(404).json({ error: "Request not found." });
      }
    } catch (err) {
      res.status(400).send(err);
    }
  }
);

/** Delete Loan Request
 * @swagger
 * /borrowers/{borrower_id}/requests/{id}:
 *   delete:
 *     tags:
 *       - Borrower Requests
 *     summary: Delete Loan Request
 *     parameters:
 *       - name: borrower_id
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
requestsController.delete("/:id", async (req, res) => {
  const { borrower_id, id } = req.params;
  try {
    const request = await deleteRequest(borrower_id, id);
    if (request.id) {
      res.status(200).json(request);
    } else {
      res.status(404).json({ error: "Request not found." });
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = requestsController;

/**
 * @swagger
 * components:
 *   schemas:
 *     Loan Request:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - value
 *         - created_at
 *         - expire_at
 *         - funded_at
 *         - accepted_proposal_id
 *         - borrower_id
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the lender
 *         title:
 *           type: string
 *           description: Loan Request Title
 *         description:
 *           type: string
 *           description: Loan Request Description
 *         value:
 *           type: number
 *           description: Loan Request Value
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Loan Request Creation Date
 *         expire_at:
 *           type: string
 *           format: date-time
 *           description: Loan Request Expiration Date
 *         update_at:
 *           type: string
 *           format: date-time
 *           description: Loan Request Update Date
 *         status:
 *           type: string
 *           description: Loan Request Status
 *         funded_at:
 *           type: string
 *           format: date-time
 *           description: Loan Request Funded Date
 *         accepted_proposal_id:
 *           type: string
 *           description: Loan Request Accepted Loan Proposal ID
 *         borrower_id:
 *           type: string
 *           description: Loan Request Borrower ID
 *       example:
 *         id: 4280107b-0715-40fa-9bdb-0388bff996ec
 *         title: Refined Steel Sausages
 *         description: The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design
 *         value: 68990.35
 *         created_at: 2024-09-08T04:00:00.000Z
 *         expire_at: 2024-10-08T04:00:00.000Z
 *         update_at: 2024-09-12T04:00:00.000Z
 *         statys: pending
 *         funded_at: 2024-10-08T04:00:00.000Z
 *         accepted_proposal_id: b8f6dbb7-3b76-4b30-9b29-c4738d8ab703
 *         borrower_id: d7b3854f-7f3e-42a2-8c86-bc7a9fecea3
 */
