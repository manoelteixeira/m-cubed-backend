// controllers/lendersController.js

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

/**
 * DONT LEAVE ON THE FINAL CODE !!!!!
 * GET all lenders
 * ROUTE: localhost:4001/lenders
 */
/**
 * @swagger
 * tags:
 *   name: Lenders
 *   description: Lenders API
 * /lenders/:
 *     get:
 *       tags:
 *         - [Lenders]
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

/**
 * CREATE a new lender
 * ROUTE: localhost:4001/lenders
 */
/**
 * @swagger
 * tags:
 *   name: Lenders
 *   description: Lenders API
 * /lenders/:
 *   post:
 *        tags:
 *          - [Lenders]
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
        // delete newLender.password;

        res.status(201).json({ lender: { ...newLender }, token });
      } else {
        res.status(400).json({ error: "Someting went wrong! (°_o)" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @swagger
 * tags:
 *   name: Lenders
 *   description: Lenders API
 * /lenders/{id}:
 *    get:
 *      tags:
 *        - [Lenders]
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
        res.status(404).json({ error: "Lender not found." });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * DELETE a single lender
 * ROUTE: localhost:4001/lenders/:id
 */
/**
 * @swagger
 * tags:
 *   name: Lenders
 *   description: Lenders API
 * /lenders/{id}:
 *     delete:
 *       tags:
 *         - [Lenders]
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

/**
 * POST update a lender
 * ROUTE: localhost:4001/lenders/:id
 */
/**
 * @swagger
 * tags:
 *   name: Lenders
 *   description: Lenders API
 * /lenders/{id}:
 *  put:
 *    tags:
 *      - [Lenders]
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
        res.status(404).json({ error: "Lender not found." });
      }
    } catch (error) {
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
 *         id: 1
 *         email: lender1@example.com
 *         password: password123
 *         business_name: Lender Corp
 */
