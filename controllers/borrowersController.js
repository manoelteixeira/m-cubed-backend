// controllers/borrowersController.js
/* Dependencies */
const express = require("express");
const {
  getBorrowers,
  getBorrower,
  createBorrower,
} = require("../queries/borrowersQueries");

/* Configurations */

borrowersController = express.Router({ mergeParams: true });

/* Routes */

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
borrowersController.post("/", async (req, res) => {
  try {
    const newBorrower = await createBorrower(req.body);
    if (newBorrower.id) {
      res.status(200).json(newBorrower);
    } else {
      res.status(400).json({ error: "Someting went wrong! (°_o)" });
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

/**
 * GET a single borrower
 * ROUTE: localhost:4001/borrowers/:id
 */
borrowersController.get("/:id", async (req, res) => {
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

module.exports = borrowersController;
