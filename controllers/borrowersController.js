// controllers/borrowersController.js

/* Dependencies */
const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// Queries
const {
  getBorrowers,
  getBorrower,
  createBorrower,
  deleteBorrower,
  updateBorrower,
} = require("../queries/borrowersQueries");
// Validators
const {
  validateEmail,
  validatePassword,
  validateCity,
  validateStreet,
  validateState,
  validateZipCode,
  validatePhone,
  validateBusinessName,
  validateCreditScore,
  validateStartDate,
  validateIndustry,
} = require("../validators/borrowersValidators");
const { authenticateToken } = require("../validators/loginValidators");

/* Configurations */
const secret = process.env.SECRET;
borrowersController = express.Router();

/* Routes */
const borrowersRequestsController = require("./borrowersRequestsController");
borrowersController.use(
  "/:borrower_id/requests",
  // authenticateToken,
  borrowersRequestsController
);

/** List All Borrowers - REMOVE THIS
 * @swagger
 * /borrowers/:
 *    get:
 *      tags:
 *        - [Borrowers]
 *      summary: List All Borrowers
 *      responses:
 *        '200':
 *          description: Successful response
 *          content:
 *            application/json: {}
 */
// borrowersController.get("/", async (req, res) => {
//   try {
//     const borrowers = await getBorrowers();
//     res.status(200).json(borrowers);
//   } catch (err) {
//     res.status(400).json({ error: err });
//   }
// });

/** Create New Borrower
 * @swagger
 * /borrowers:
 *   post:
 *     tags:
 *       - [Borrowers]
 *     summary: Create New Borrower
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               email: testBorrower@example.com
 *               password: password123
 *               city: Miami
 *               street: 987 Maple St
 *               state: FL
 *               zip_code: '33101'
 *               phone: '4567890123'
 *               business_name: Healthcare Hub
 *               credit_score: 740
 *               start_date: '2022-10-05T04:00:00.000Z'
 *               industry: Healthcare
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json: {}
 */
borrowersController.post(
  "/",
  validateEmail,
  validatePassword,
  validateCity,
  validateStreet,
  validateState,
  validateZipCode,
  validatePhone,
  validateBusinessName,
  validateCreditScore,
  validateStartDate,
  validateIndustry,
  async (req, res) => {
    try {
      const newBorrower = await createBorrower(req.body);
      const token = jwt.sign(
        { userId: newBorrower.id, email: newBorrower.email },
        secret
      );
      delete newBorrower.password;
      if (newBorrower.id) {
        const token = jwt.sign(
          { userId: newBorrower.id, email: newBorrower.email },
          secret
        );
        delete newBorrower.password;
        res.status(200).json({ borrower: { ...newBorrower }, token });
      } else {
        res.status(400).json({ error: "Someting went wrong! (°_o)" });
      }
    } catch (err) {
      res.status(400).json({ error: err });
    }
  }
);

/** Get Borrower By ID
 * @swagger
 * /borrowers/{id}:
 *   get:
 *     tags:
 *       - [Borrowers]
 *     summary: Get Borrower By ID
 *     parameters:
 *       - name: id
 *         in: path
 *         schema:
 *           type: integer
 *         required: true
 *         example: '1'
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json: {}
 */
borrowersController.get(
  "/:id",
  // authenticateToken,
  async (req, res) => {
    try {
      const { id } = req.params;
      const borrower = await getBorrower(Number(id));
      if (borrower.id) {
        res.status(200).json(borrower);
      } else {
        res.status(404).json({ error: "Borrower not found." });
      }
    } catch (err) {
      res.status(400).json({ error: err });
    }
  }
);

/**
 * @swagger
 * /borrowers/{id}:
 *   delete:
 *     tags:
 *       - [Borrowers]
 *     summary: Delete
 *     parameters:
 *       - name: id
 *         in: path
 *         schema:
 *           type: integer
 *         required: true
 *         example: '6'
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json: {}
 */
borrowersController.delete(
  "/:id",
  // authenticateToken,
  async (req, res) => {
    try {
      const { id } = req.params;
      const borrower = await deleteBorrower(Number(id));
      if (borrower.id) {
        res.status(200).json(borrower);
      } else {
        res.status(404).json({ error: "Borrower not found." });
      }
    } catch (err) {
      res.status(400).json({ error: err });
    }
  }
);

/** Update Borrower
 * @swagger
 * /borrowers/{id}:
 *   put:
 *     tags:
 *       - [Borrowers]
 *     summary: Update Borrower
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               email: testBorrowerTest@example.com
 *               city: Miami
 *               street: 987 Maple St
 *               state: FL
 *               zip_code: '33101'
 *               phone: '4567890123'
 *               business_name: Healthcare Hub
 *               credit_score: 740
 *               start_date: '2022-10-05T04:00:00.000Z'
 *               industry: Healthcare
 *     parameters:
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
borrowersController.put(
  "/:id",
  validateEmail,
  validateCity,
  validateStreet,
  validateState,
  validateZipCode,
  validatePhone,
  validateBusinessName,
  validateCreditScore,
  validateStartDate,
  validateIndustry,
  // authenticateToken,
  async (req, res) => {
    try {
      const { id } = req.params;
      const borrower = await updateBorrower(Number(id), req.body);

      if (borrower.id) {
        res.status(200).json(borrower);
      } else {
        res.status(404).json({ error: "Borrower not found." });
      }
    } catch (err) {
      res.status(400).json({ error: err });
    }
  }
);

module.exports = borrowersController;

/**
 * @swagger
 * components:
 *   schemas:
 *     Borrower:
 *       type: object
 *       required:
 *        - email
 *        - password
 *        - city
 *        - street
 *        - state
 *        - zip_code
 *        - phone
 *        - business_name
 *        - credit_score
 *        - start_date
 *        - industry
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the Borrower
 *         email:
 *           type: string
 *           description: Borrower email
 *         password:
 *           type: string
 *           description: Borrower password
 *         city:
 *           type: string
 *           description: Borrower business city
 *         street:
 *           type: string
 *           description: Borrower business street
 *         state:
 *           type: string
 *           description: Borrower business state
 *         zip_code:
 *           type: string
 *           description: Borrower business ZIP code
 *         phone:
 *           type: string
 *           description: Borrower business phone number
 *         business_name:
 *           type: string
 *           description: Borrower business name
 *         credit_score:
 *           type: integer
 *           description: Borrower business credit score
 *         start_date:
 *           type: date
 *           description: Borrower business start date
 *         industry :
 *           type: string
 *           description: Borrower business industry
 *       example:
 *         id: 1
 *         email: borrower1@example.com
 *         city: New York
 *         street: 123 Main St
 *         state: NY
 *         zip_code: 10001
 *         phone: 1234567890
 *         business_name: Small Biz LLC
 *         credit_score: 720,
 *         start_date: 2020-05-15T04:00:00.000Z
 *         industry: Retail
 */
