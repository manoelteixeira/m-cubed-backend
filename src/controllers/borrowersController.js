// src/controllers/borrowersController.js
/**
 * @swagger
 * tags:
 *   name: Borrowers
 *   description: Operations related to borrowers.
 */

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
const { getCreditReports } = require("../queries/creditReportsQueries");
// Validators
const {
  validateCity,
  validateStreet,
  validateState,
  validateZipCode,
  validatePhone,
  validateEIN,
  validateStartDate,
  validateIndustry,
} = require("../validators/borrowersValidators");

const {
  validateEmail,
  validatePassword,
  validateBusinessName,
  validateImageURL,
} = require("../validators/validators");

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
 *        - Borrowers
 *      summary: List All Borrowers
 *      responses:
 *        '200':
 *          description: Successful response
 *          content:
 *            application/json: {}
 */
borrowersController.get("/", async (req, res) => {
  try {
    const borrowers = await getBorrowers();
    res.status(200).json(borrowers);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

/** Create New Borrower
 * @swagger
 * /borrowers:
 *   post:
 *     tags:
 *       - Borrowers
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
 *               ein: '431211532'
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
  validateEIN,
  validateStartDate,
  validateIndustry,
  async (req, res) => {
    try {
      const newBorrower = await createBorrower(req.body);
      if (newBorrower.id) {
        const token = jwt.sign(
          { userId: newBorrower.id, email: newBorrower.email },
          secret
        );
        delete newBorrower.password;
        delete newBorrower.user_id;
        res.status(201).json({ borrower: { ...newBorrower }, token });
      } else {
        res.status(400).json({ error: newBorrower.error });
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
 *       - Borrowers
 *     summary: Get Borrower By ID
 *     parameters:
 *       - name: id
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: Successful response.
 *       '404':
 *         description: Not found - Borrower Not Found.
 *       '500':
 *         description: Internal Server Error.
 */
borrowersController.get(
  "/:id",
  // authenticateToken,
  async (req, res) => {
    const { id } = req.params;
    try {
      const borrower = await getBorrower(id);
      if (borrower.id) {
        const reports = await getCreditReports(borrower.id);
        const credit_reports = Array.isArray(reports) ? reports : [];

        res.status(200).json({ borrower, credit_reports });
      } else {
        res.status(404).json({ error: "Borrower not found." });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/** Delete Borrower By ID
 * @swagger
 * /borrowers/{id}:
 *   delete:
 *     tags:
 *       - Borrowers
 *     summary: Delete
 *     parameters:
 *       - name: id
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: Successful response.
 *       '404':
 *         description: Not found - Borrower Not Found.
 *       '500':
 *         description: Internal Server Error.
 */
borrowersController.delete(
  "/:id",
  // authenticateToken,
  async (req, res) => {
    const { id } = req.params;
    try {
      const deletedBorrower = await deleteBorrower(id);
      if (deletedBorrower.id) {
        res.status(200).json(deletedBorrower);
      } else {
        res.status(404).json({ error: deletedBorrower.error });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/** Update Borrower
 * @swagger
 * /borrowers/{id}:
 *   put:
 *     tags:
 *       - Borrowers
 *     summary: Update Borrower
 *     description: This route does not update email or password.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               city: Miami
 *               street: 987 Maple St
 *               state: FL
 *               zip_code: '33101'
 *               phone: '4567890123'
 *               business_name: Healthcare Hub
 *               image_url: https://placehold.co/600x400
 *               ein: '431211532'
 *               start_date: '2022-10-05T04:00:00.000Z'
 *               industry: Healthcare
 *     parameters:
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
borrowersController.put(
  "/:id",
  validateCity,
  validateStreet,
  validateState,
  validateZipCode,
  validatePhone,
  validateBusinessName,
  validateEIN,
  validateStartDate,
  validateIndustry,
  validateImageURL,
  // authenticateToken,
  async (req, res) => {
    try {
      const { id } = req.params;
      const borrower = await updateBorrower(id, req.body);

      if (borrower.id) {
        res.status(200).json(borrower);
      } else {
        res.status(404).json({ error: borrower.err });
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
 *        - ein
 *        - start_date
 *        - industry
 *       properties:
 *         id:
 *           type: string
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
 *         image_url:
 *           type: string
 *           description: The Lender business image
 *         ein:
 *           type: string
 *           description: Borrower Employer Identification Number.
 *         start_date:
 *           type: date
 *           description: Borrower business start date
 *         industry :
 *           type: string
 *           description: Borrower business industry
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
