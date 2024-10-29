// src/controllers/matchMessageController.js
/**
 * @swagger
 * tags:
 *   name: Loan Match Messages
 *   description: Operations related to Loan Match Messages.
 */

/* Dependencies */
const express = require("express");

/* Configuration */
matchMessagesController = express.Router();

/* Routes */

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
 *           description: id of the loan
 *         loan_request_id:
 *           type: string
 *           description:
 *         created_at:
 *           type: string
 *           description:
 *         sender:
 *           type: string
 *           description:
 *         message:
 *           type: string
 *           description:
 *       example:
 *         id: "uuidStrin012312341"
 *         email: borrower1@example.com
 *         city: New York
 *         street: 123 Main St
 *         state: NY
 *         zip_code: 10001
 *         phone: '1234567890'
 *         business_name: Small Biz LLC
 *         image_url: https://placehold.co/600x400
 *         ein: '431211532'
 *         start_date: 2020-05-15T04:00:00.000Z
 *         industry: Retail
 */
