// src/controllers/lendersRequestsController.js
/**
 * @swagger
 * tags:
 *   name: Lenders Requests
 *   description: Operations related to loan requests available for a given lender.
 */

const express = require("express");
const requests = express.Router({ mergeParams: true });
// Importing validators
const {
  validateLoanAmount,
  validateInterestRate,
  validateRequirements,
  validateRepaymentTerm,
  validateQuerySort,
  validateQueryOrder,
  validateQueryLimit,
  validateQueryOffset,
  validateSearch,
  validateHide,
  validateFavorite,
} = require("../validators/lendersProposalsValidators");

const {
  validateTitle,
  validateDescription,
  validateCreatedAt,
  validateExpireAt,
} = require("../validators/validators");

// Importing queries
const {
  getAllLoanRequests,
  getLoanRequestByID,
  createProposal,
  setRequestHide,
  setRequestFavorite,
} = require("../queries/lendersRequestsQueries");

/* Routes */

/** GET - Get All Available Loan Requests
 * @swagger
 * /lenders/{id}/requests:
 *  get:
 *    tags:
 *      - Lenders Requests
 *    summary: List All Available Loan Requests
 *    parameters:
 *           - name: search
 *             in: query
 *             schema:
 *               type: string
 *           - name: sort
 *             in: query
 *             schema:
 *               type: string
 *           - name: order
 *             in: query
 *             schema:
 *               type: string
 *           - name: limit
 *             in: query
 *             schema:
 *               type: integer
 *           - name: offset
 *             in: query
 *             schema:
 *               type: integer
 *           - name: lender_id
 *             in: path
 *             schema:
 *               type: string
 *             required: true
 *    responses:
 *      '200':
 *        description: Successful response
 *        content:
 *          application/json: {}
 */
requests.get(
  "/",
  validateQuerySort,
  validateQueryOrder,
  validateQueryLimit,
  validateQueryOffset,
  async (req, res) => {
    const { sort, order, limit, offset, search } = req.query;
    const { lender_id } = req.params;
    try {
      const loanRequests = await getAllLoanRequests(
        lender_id,
        sort,
        order,
        limit,
        offset,
        search
      );
      res.status(200).json(loanRequests);
    } catch (error) {
      console.error("Error fetching all loan requests:", error);
      res.status(500).json({ error: "Failed to fetch loan requests" });
    }
  }
);

/** GET - Get Loan Request By ID
 * @swagger
 * /lenders/{lender_id}/requests/{id}:
 *  get:
 *    tags:
 *      - Lenders Requests
 *    summary: Get an Loan Request by ID
 *    parameters:
 *      - in: path
 *        name: lender_id
 *        schema:
 *          type: string
 *        required: true
 *        description: Lender ID
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Request ID
 *    responses:
 *      '200':
 *        description: Successful response
 *        content:
 *          application/json: {}
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

/** POST - Set Hide
 * @swagger
 * /lenders/{lender_id}/requests/{id}/hide:
 *  post:
 *    tags:
 *      - Lenders Requests
 *    summary: Set Request Hide Property
 *    parameters:
 *      - in: path
 *        name: lender_id
 *        schema:
 *          type: string
 *        required: true
 *        description: Lender ID
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Request ID
 *    requestBody:
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  example:
 *                    hide: true
 *    responses:
 *      '200':
 *        description: Successful response
 *        content:
 *          application/json: {}
 */
requests.post("/:id/hide", validateHide, async (req, res) => {
  const { lender_id, id } = req.params;
  const { hide } = req.body;
  try {
    const data = await setRequestHide(lender_id, id, hide);
    if (data.lender_id) {
      res.status(201).json(data);
    }
  } catch (err) {
    res.status(500).json({ error: "Something whent Wrong" });
  }
});

/** POST - Set Favorite
 * @swagger
 * /lenders/{lender_id}/requests/{id}/favorite:
 *  post:
 *    tags:
 *      - Lenders Requests
 *    summary: Set Request Favorite Property
 *    parameters:
 *      - in: path
 *        name: lender_id
 *        schema:
 *          type: string
 *        required: true
 *        description: Lender ID
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Request ID
 *    requestBody:
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  example:
 *                    favorite: true
 *    responses:
 *      '200':
 *        description: Successful response
 *        content:
 *          application/json: {}
 */
requests.post("/:id/favorite", validateFavorite, async (req, res) => {
  const { lender_id, id } = req.params;
  const { favorite } = req.body;

  try {
    const data = await setRequestFavorite(lender_id, id, favorite);

    if (data.lender_id) {
      res.status(201).json(data);
    }
  } catch (err) {
    res.status(500).json({ error: "Something whent Wrong" });
  }
});

/** POST - Create Loan Proposal
 * @swagger
 * /lenders/{lender_id}/requests/{id}:
 *  post:
 *    tags:
 *      - Lenders Requests
 *    summary: Create an Loan Proposal
 *    parameters:
 *      - in: path
 *        name: lender_id
 *        schema:
 *          type: string
 *        required: true
 *        description: Lender ID
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Request ID
 *    requestBody:
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  example:
 *                    title: Low-Interest Proposal TEST
 *                    description: Offering a low-interest loan with flexible repayment options.
 *                    requirements: [Personal Garantee, Down Payment]
 *                    created_at: '2023-01-20T05:00:00.000Z'
 *                    expire_at: '2023-02-20T05:00:00.000Z'
 *                    loan_amount: 50000
 *                    interest_rate: 5
 *                    repayment_term: 36
 *    responses:
 *      '200':
 *        description: Successful response
 *        content:
 *          application/json: {}
 */
requests.post(
  "/:id",
  validateTitle,
  validateDescription,
  validateRequirements,
  validateCreatedAt,
  validateExpireAt,
  validateLoanAmount,
  validateInterestRate,
  validateRepaymentTerm,
  async (req, res) => {
    const { lender_id, id } = req.params;
    const proposal = req.body;
    const { requirements } = proposal;
    proposal.requirements = requirements.length == 0 ? null : requirements;

    proposal.loan_request_id = id;
    proposal.lender_id = lender_id;
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
