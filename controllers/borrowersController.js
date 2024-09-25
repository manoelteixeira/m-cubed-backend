// controllers/borrowersController.js
/* Dependencies */
const express = require("express");
const jwt = require("jsonwebtoken");
const {
  getBorrowers,
  getBorrower,
  createBorrower,
  deleteBorrower,
  updateBorrower,
} = require("../queries/borrowersQueries");

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
borrowersController = express.Router();
require("dotenv").config();
const secret = process.env.SECRET;

/* Routes */
const borrowersRequestsController = require("./borrowersRequestsController");
borrowersController.use(
  "/:borrower_id/requests",
  authenticateToken,
  borrowersRequestsController
);

/**
 * DONT LEAVE ON THE FINAL CODE !!!!!
 * GET all borrowers
 * ROUTE: localhost:4001/borrowers
 */
borrowersController.get("/", async (req, res) => {
  try {
    const borrowers = await getBorrowers();
    res.status(200).json(borrowers);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

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
borrowersController.get("/:id", authenticateToken, async (req, res) => {
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
});

/**
 * DELETE a single borrower
 * ROUTE: localhost:4001/borrowers/:id
 */
borrowersController.delete("/:id", authenticateToken, async (req, res) => {
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
});

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
  authenticateToken,
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
