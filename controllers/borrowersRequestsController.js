// controllers/borrowersRequestsController.js
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
 *       - [Borrower Requests]
 *     summary: List All Loan Requests
 *     parameters:
 *       - name: borrower_id
 *         in: path
 *         schema:
 *           type: integer
 *         required: true
 *         example: '2'
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json: {}
 */
requestsController.get("/", async (req, res) => {
  console.log(req.user);
  const { borrower_id } = req.params;
  try {
    const requests = await getRequests(Number(borrower_id));
    res.status(200).json(requests);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

/** Create New Loan Request
 * @swagger
 * /borrowers/{borrower_id}/requests:
 *   post:
 *     tags:
 *       - [Borrower Requests]
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
 *     parameters:
 *       - name: borrower_id
 *         in: path
 *         schema:
 *           type: integer
 *         required: true
 *         example: '2'
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
  async (req, res) => {
    const { borrower_id } = req.params;
    try {
      const request = await createRequest({
        ...req.body,
        borrower_id: Number(borrower_id),
      });
      console.log(request);
      if (request.id) {
        res.status(200).json(request);
      } else {
        res.status(400).json(request);
      }
    } catch (err) {
      res.status(400).json({ error: err });
    }
  }
);

/** Get One Loan Request
 * @swagger
 * /borrowers/{borrower_id}/requests/{id}:
 *   get:
 *     tags:
 *       - [Borrower Requests]
 *     summary: Get One Loan Request
 *     parameters:
 *       - name: borrower_id
 *         in: path
 *         schema:
 *           type: integer
 *         required: true
 *         example: '1'
 *       - name: id
 *         in: path
 *         schema:
 *           type: integer
 *         required: true
 *         example: '8'
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json: {}
 */
requestsController.get("/:id", async (req, res) => {
  const { borrower_id, id } = req.params;
  try {
    const request = await getRequest(Number(borrower_id), Number(id));
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
 *       - [Borrower Requests]
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
 *           type: integer
 *         required: true
 *         example: '2'
 *       - name: id
 *         in: path
 *         schema:
 *           type: integer
 *         required: true
 *         example: '12'
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
        borrower_id: Number(borrower_id),
        id: Number(id),
      });
      if (request.id) {
        res.status(200).json(request);
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
 *       - [Borrower Requests]
 *     summary: Delete Loan Request
 *     parameters:
 *       - name: borrower_id
 *         in: path
 *         schema:
 *           type: integer
 *         required: true
 *         example: '2'
 *       - name: id
 *         in: path
 *         schema:
 *           type: integer
 *         required: true
 *         example: '15'
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json: {}
 */
requestsController.delete("/:id", async (req, res) => {
  const { borrower_id, id } = req.params;
  try {
    const request = await deleteRequest(Number(borrower_id), Number(id));
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
 *           format: date
 *           description: Loan Request Creation Date
 *         funded_at:
 *           type: string
 *           format: date
 *           description: Loan Request Funded Date
 *         accepted_proposal_id:
 *           type: number
 *           description: Loan Request Accepted Loan Proposal ID
 *         borrower_id:
 *           type: number
 *           description: Loan Request Borrower ID
 *       example:
 *         id: 1
 *         email: lender1@example.com
 *         password: password123
 *         business_name: Lender Corp
 */
