// controllers/borrowersController.js

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
 *         id: 1,
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

/**
 * @swagger
 * /borrowers:
 *   get:
 *     summary: Get All Borrowers.
 *     description: Get All Borrowers. This should not be on the final project
 *     responses:
 *       '200':
 *         description: A successful response
 *       '404':
 *         description: Employee not found
 *       '500':
 *         description: Internal server error
 */
// borrowersController.get("/", async (req, res) => {
//   try {
//     const borrowers = await getBorrowers();
//     res.status(200).json(borrowers);
//   } catch (err) {
//     res.status(400).json({ error: err });
//   }
// });

/**
 * CREATE a new borrower
 * ROUTE: localhost:4001/borrowers
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

/**
 * GET a single borrower
 * ROUTE: localhost:4001/borrowers/:id
 */
/**
 * @swagger
 * /borrowers/{id}:
 *   get:
 *     summary: GET a single borrower
 *     description: GET a single borrower.
 *     parameters:
 *       - in: path
 *         name: id
 *     responses:
 *       '200':
 *         description: A successful response
 *       '404':
 *         description: Employee not found
 *       '500':
 *         description: Internal server error
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
 * DELETE a single borrower
 * ROUTE: localhost:4001/borrowers/:id
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

/**
 * POST update a borrower
 * ROUTE: localhost:4001/borrowers/:id
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
