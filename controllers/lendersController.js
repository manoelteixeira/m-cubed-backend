const express = require("express");
const jwt = require("jsonwebtoken");
const lenders = express.Router();
const lendersProposalsController = require("./lendersProposalsController");
require("dotenv").config();
const secret = process.env.SECRET;

// Import validation middleware
const {
  validateEmail,
  validatePassword,
  validateBusinessName,
} = require("../validators/lendersValidators");
const { authenticateToken } = require("../validators/loginValidators");

// Middleware to handle proposals routes for specific lenders
lenders.use(
  "/:lender_id/proposals",
  authenticateToken,
  lendersProposalsController
);

const {
  getAllLenders,
  getLender,
  createLender,
  deleteLender,
  updateLender,
  getLenderByProposalID,
} = require("../queries/lendersQueries");

// Route to get all lenders
lenders.get("/", async (req, res) => {
  try {
    const lendersList = await getAllLenders();
    res.status(200).json(lendersList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get a specific lender by ID
lenders.get("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const lender = await getLender(id);
    if (lender) {
      res.status(200).json(lender);
    } else {
      res.status(404).json({ error: "Lender not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to create a new lender with validation middleware
lenders.post(
  "/",
  validateEmail,
  validatePassword,
  validateBusinessName,
  async (req, res) => {
    const lender = req.body;
    try {
      const newLender = await createLender(lender);
      const token = jwt.sign(
        { userId: newLender.id, email: newLender.email },
        secret
      );
      delete newLender.password;
      res.status(201).json({ lender: { ...newLender }, token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Route to delete a lender by ID
lenders.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedLender = await deleteLender(id);
    res.status(200).json(deletedLender);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to update a lender by ID with validation middleware
lenders.put(
  "/:id",
  validateEmail,
  validatePassword,
  validateBusinessName,
  authenticateToken,
  async (req, res) => {
    const { id } = req.params;
    const lender = req.body;
    try {
      const updatedLender = await updateLender(id, lender);
      res.status(200).json(updatedLender);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Route to get a lender by proposal ID
// lenders.get("/proposal/:proposal_id", async (req, res) => {
//   const { proposal_id } = req.params;
//   try {
//     const lender = await getLenderByProposalID(proposal_id);
//     if (lender) {
//       res.status(200).json(lender);
//     } else {
//       res.status(404).json({ error: "Lender not found for proposal" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

module.exports = lenders;
