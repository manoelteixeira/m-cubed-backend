// src/controllers/matchMessagesController.js
/**
 * @swagger
 * tags:
 *   name: Loan Match Messages
 *   description: Operations related to Loan Match Messages.
 */

/* Dependencies */
const express = require("express");
const {
  getAllMessages,
  getMessages,
  newMessage,
} = require("../queries/matchMessagesQueries");
const {
  validateSender,
  validateMessage,
} = require("../validators/matchMessagesValidators");
const { authenticateToken } = require("../validators/loginValidators");

/* Configuration */
matchMessagesController = express.Router();

/* Routes */

/** List All Messages - REMOVE THIS
 * @swagger
 * /messages/:
 *    get:
 *      tags:
 *        - Loan Match Messages
 *      summary: List All Loan Match Messages - REMOVE THIS!!
 *      responses:
 *        '200':
 *          description: Successful response
 *          content:
 *            application/json: {}
 */
matchMessagesController.get("/", async (req, res) => {
  try {
    const messages = await getAllMessages();
    res.status(200).json(messages);
  } catch (err) {
    res.status(400).json({ error: "Something went wrong." });
  }
});

/** List All Messages For a given Accepted Loan Proposal
 * @swagger
 * /messages/{proposal_id}/:
 *    get:
 *      tags:
 *        - Loan Match Messages
 *      summary: List All Messages For a given Accepted Loan Proposal
 *      parameters:
 *        - in: path
 *          name: proposal_id
 *          schema:
 *              type: string
 *              format: uuid
 *              required: true
 *              description: Accepted Loan Proposal ID
 *      responses:
 *        '200':
 *          description: Successful response
 *          content:
 *            application/json: {}
 */
matchMessagesController.get(
  "/:id",
  // authenticateToken,
  async (req, res) => {
    const { id } = req.params;
    try {
      const messages = await getMessages(id);
      res.status(200).json(messages);
    } catch (err) {
      res.status(500).json(err);
      //   res.status(500).json({error: "Something whent wrong"});
    }
  }
);

/** Create New Borrower
 * @swagger
 * /messages/{proposal_id}/:
 *    post:
 *      tags:
 *        - Loan Match Messages
 *      summary: Create New Loan Match Message
 *      parameters:
 *        - in: path
 *          name: proposal_id
 *          schema:
 *              type: string
 *              format: uuid
 *              required: true
 *              description: Accepted Loan Proposal ID
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example:
 *                sender: lender
 *                message: hey there
 *      responses:
 *        '200':
 *          description: Successful response
 *          content:
 *            application/json: {}
 */
matchMessagesController.post(
  "/:id",
  validateSender,
  validateMessage,
  //   authenticateToken,
  async (req, res) => {
    // const { id } = req.params;
    const data = req.body;
    data.id = req.params.id;
    try {
      const message = await newMessage(data);
      res.status(201).json(message);
    } catch (err) {
      res.status(500).json(err);
      //   res.status(500).json({ error: "Something went wrong." });
    }
  }
);

module.exports = matchMessagesController;

/**
 * @swagger
 * components:
 *   schemas:
 *     Loan Match Message:
 *       type: object
 *       required:
 *        - loan_proposal_id
 *        - loan_request_id
 *        - sender
 *        - message
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the Loan Match Message
 *         loan_proposal_id:
 *           type: string
 *           description: id of the loan proposal accepted
 *         created_at:
 *           type: string
 *           description: date of the message
 *         sender:
 *           type: string
 *           description:
 *         message:
 *           type: string
 *           description:
 *       example:
 *         id: "uuidStrin012312341"
 *         loan_proposal_id: "uuidLoanProposal"
 *         created_at: 2020-05-15T04:00:00.000Z
 *         sender: sender_business_name
 *         message: message
 */
