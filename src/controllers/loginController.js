// src/controllers/loginController.js
/**
 * @swagger
 * tags:
 *   name: Login
 *   description: Operations related to login.
 */

/* Dependencies */
const express = require("express");
const jwt = require("jsonwebtoken");
const { getUsers, logInUser } = require("../queries/loginQueries");

const { validateEmail, validatePassword } = require("../validators/validators");

/* Configurations */
require("dotenv").config();
const secret = process.env.SECRET;
const loginController = express.Router();

/* Routes */
/** List all Users - REMOVE THIS ROUTE
 * @swagger
 * /login/:
 *     get:
 *       tags:
 *         - Login
 *       summary: List all Users
 *       responses:
 *         '200':
 *           description: Successful response
 *           content:
 *             application/json: {}
 */
loginController.get("/", async (req, res) => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

/** Create new Lender
 * @swagger
 * /login/:
 *   post:
 *        tags:
 *          - Login
 *        summary: Log in user
 *        requestBody:
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                example:
 *                  email: <user email>
 *                  password: <password>
 *        responses:
 *          '200':
 *            description: Successful response
 *          '400':
 *            description: Bad Request - Invalid
 *          '401':
 *            description: Unauthorized - Incorrect email or passwor
 */
loginController.post("/", validateEmail, validatePassword, async (req, res) => {
  try {
    const user = await logInUser(req.body);
    if (user.error) {
      res.status(401).json({ error: "Incorrect email or password" });
    } else {
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60, // Token expire in 12h
        },
        secret
      );
      res.status(202).json({ ...user, token });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error." });
  }
});

module.exports = loginController;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - role
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the User
 *         email:
 *           type: string
 *           description: The User email
 *         password:
 *           type: string
 *           description: The User password
 *         last_logged:
 *           type: string
 *           format: date
 *           description: Last time the user logged in
 *         role:
 *           type: string
 *           description: lender or borrower
 *       example:
 *         id: ff5934c5-62b4-4c52-b933-a2ac86a2a86c
 *         email: testUser@example.com
 *         password: password123
 *         last_logged: 2024-10-18T04:00:00.000Z
 *         role: 'lender'
 */
