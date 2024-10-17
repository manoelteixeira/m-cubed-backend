// src/controllers/lendersController.js
/**
 * @swagger
 * tags:
 *   name: Lenders
 *   description: Operations related to lenders.
 */

/* Dependencies */
const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// Queries
const {
  getAllLenders,
  getLender,
  createLender,
  deleteLender,
  updateLender,
} = require("../queries/lendersQueries");
// Validators
const {
  validateEmail,
  validatePassword,
  validateBusinessName,
} = require("../validators/lendersValidators");
const { authenticateToken } = require("../validators/loginValidators");

/* Configurations */
const lenders = express.Router();
const secret = process.env.SECRET;

/* Routes */
const lendersProposalsController = require("./lendersProposalsController");
lenders.use(
  "/:lender_id/proposals",
  // authenticateToken,
  lendersProposalsController
);
const lendersRequestsController = require("./lendersRequestsController");
lenders.use(
  "/:lender_id/requests",
  // authenticateToken,
  lendersRequestsController
);

/** List all Lenders - REMOVE THIS ROUTE
 * @swagger
 * /lenders/:
 *     get:
 *       tags:
 *         - Lenders
 *       summary: List all Lenders
 *       responses:
 *         '200':
 *           description: Successful response
 *           content:
 *             application/json: {}
 */
lenders.get("/", async (req, res) => {
  try {
    const lendersList = await getAllLenders();
    res.status(200).json(lendersList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/** Create new Lender
 * @swagger
 * /lenders/:
 *   post:
 *        tags:
 *          - Lenders
 *        summary: Create new Lender
 *        requestBody:
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                example:
 *                  email: testLender@example.com
 *                  password: password123
 *                  business_name: Lender Corp
 *        responses:
 *          '200':
 *            description: Successful response
 *            content:
 *              application/json: {}
 */
lenders.post(
  "/",
  validateEmail,
  validatePassword,
  validateBusinessName,
  async (req, res) => {
    const lender = req.body;
    try {
      const newLender = await createLender(lender);
      if (newLender.id) {
        const token = jwt.sign(
          { userId: newLender.id, email: newLender.email },
          secret
        );
        res.status(201).json({ lender: { ...newLender }, token });
      } else {
        res.status(400).json(newLender);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

/** Get Lender By ID
 * @swagger
 * /lenders/{id}:
 *    get:
 *      tags:
 *        - Lenders
 *      summary: Get Lender By ID
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: Lender ID
 *      responses:
 *        '200':
 *          description: Successful response
 *          content:
 *            application/json: {}
 */
lenders.get(
  "/:id",
  // authenticateToken,
  async (req, res) => {
    const { id } = req.params;
    try {
      const lender = await getLender(id);
      if (lender.id) {
        res.status(200).json(lender);
      } else {
        res.status(404).json({ error: lender.error });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/** Delete Lender By ID
 * @swagger
 * /lenders/{id}:
 *     delete:
 *       tags:
 *         - Lenders
 *       summary: Delete Lender By ID
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: Lender ID
 *       responses:
 *         '200':
 *           description: Successful response
 *           content:
 *             application/json: {}
 */
lenders.delete(
  "/:id",
  // authenticateToken,
  async (req, res) => {
    const { id } = req.params;
    try {
      const deletedLender = await deleteLender(id);
      if (deletedLender.id) {
        res.status(200).json(deletedLender);
      } else {
        res.status(404).json({ error: "Lender not found." });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/** Update Lender
 * @swagger
 * /lenders/{id}:
 *  put:
 *    tags:
 *      - Lenders
 *    summary: Update Lender
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Lender ID
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            example:
 *              email: lender1@example.com
 *              password: password1233
 *              business_name: Lender Corp
 *    responses:
 *      '200':
 *        description: Successful response
 *        content:
 *          application/json: {}
 */
lenders.put(
  "/:id",
  validateEmail,
  validatePassword,
  validateBusinessName,
  // authenticateToken,
  async (req, res) => {
    const { id } = req.params;
    const lender = req.body;
    try {
      const updatedLender = await updateLender(id, lender);
      if (updatedLender.id) {
        res.status(200).json(updatedLender);
      } else {
        res.status(404).json({ error: updatedLender.error });
      }
    } catch (error) {
      console.error("errrirr");
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = lenders;

/**
 * @swagger
 * components:
 *   schemas:
 *     Lender:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - business_name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the lender
 *         user_id:
 *           type: string
 *           description: The auto-generated id of the lender
 *         email:
 *           type: string
 *           description: The Lender email
 *         password:
 *           type: string
 *           description: The Lender password
 *         business_name:
 *           type: string
 *           description: The Lender business name
 *       example:
 *         id: ff5934c5-62b4-4c52-b933-a2ac86a2a86c
 *         user_id: ff5934c5-62b4-4c52-b933-a2ac86a2a862
 *         email: lender1@example.com
 *         password: password123
 *         business_name: Lender Corp
 */
