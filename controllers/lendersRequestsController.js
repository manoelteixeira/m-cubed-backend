const express = require("express");
const requests = express.Router({ mergeParams: true });
// Importing validators
const {
  validateTitle,
  validateDescription,
  validateCreatedAt,
  validateLoanAmount,
  validateInterestRate,
  validateRepaymentTerm,
} = require("../validators/lendersProposalsValidators");

// Importing queries
const {
  getAllLoanRequests,
  getLoanRequestByID,
  createProposal,
} = require("../queries/lendersRequestsQueries");

/* Routes */

/** GET - Get All Available Loan Requests
 * @swagger
 * /lenders/{id}/requests:
 *  get:
 *    tags:
 *      - [Lenders Requests]
 *    summary: List All Available Loan Requests
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

/** GET - Get Loan Request By ID
 * @swagger
 * /lenders/{lender_id}/requests/{id}:
 *  get:
 *    tags:
 *      - [Lenders Requests]
 *    summary: Get an Loan Request by ID
 *    parameters:
 *      - in: path
 *        name: lender_id
 *        schema:
 *          type: number
 *        required: true
 *        description: Lender ID
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
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

/** POST - Create Loan Proposal
 * @swagger
 * /lenders/{lender_id}/requests/{id}:
 *  post:
 *    tags:
 *      - [Lenders Requests]
 *    summary: Create an Loan Proposal
 *    parameters:
 *      - in: path
 *        name: lender_id
 *        schema:
 *          type: number
 *        required: true
 *        description: Lender ID
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
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
 *                    created_at: '2023-01-20T05:00:00.000Z'
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
  validateCreatedAt,
  validateLoanAmount,
  validateInterestRate,
  validateRepaymentTerm,
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
