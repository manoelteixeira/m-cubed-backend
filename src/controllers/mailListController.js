// src/controllers/mailListController.js
/**
 * @swagger
 * tags:
 *   name: Mail List
 *   description: Operations related the mail list
 */
const express = require("express");
const {
  getEmails,
  addEmail,
  deleteEmail,
} = require("../queries/mailListQueries");
const { validateEmail } = require("../validators/validators");

const mailListController = express.Router();

/** List All Email - REMOVE THIS
 * @swagger
 * /mail-list/:
 *    get:
 *      tags:
 *        - Mail List
 *      summary: List All Emails
 *      responses:
 *        '200':
 *          description: Successful response
 *          content:
 *            application/json: {}
 */
mailListController.get("/", async (req, res) => {
  try {
    const emails = await getEmails();
    if (Array.isArray(emails)) {
      res.status(200).json(emails);
    } else {
      res.status(500).json({ error: "Something whent wrong." });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

/** Create New Borrower
 * @swagger
 * /mail-list:
 *   post:
 *     tags:
 *       - Mail List
 *     summary: Add new email to mail list
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               email: testBorrower@example.com
 *               role: other
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json: {}
 */
mailListController.post("/", validateEmail, async (req, res) => {
  try {
    const newEmail = await addEmail(req.body);
    if (newEmail.id) {
      res.status(201).json(newEmail);
    } else {
      res.status(400).json({ error: "Email already registered." });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/** Delete Borrower By ID
 * @swagger
 * /mail-list/{id}:
 *   delete:
 *     tags:
 *       - Mail List
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
mailListController.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const email = await deleteEmail(id);
    if (email.id) {
      res.status(200).json(email);
    } else {
      res.status(404).json({ email: error });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = mailListController;

/**
 * @swagger
 * components:
 *   schemas:
 *     Mail List:
 *       type: object
 *       required:
 *        - email
 *        - role
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the Borrower
 *         email:
 *           type: string
 *           description: Borrower email
 *         role:
 *           type: string
 *           description: user role. e.g. lender, borrower, other
 *       example:
 *         id: "uuidStrin012312341"
 *         email: user@example.com
 *         role: other
 */
