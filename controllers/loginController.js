// controllers/loginController.js
/* Dependencies */
const express = require("express");
const jwt = require("jsonwebtoken");
const { logInUser } = require("../queries/loginQueries");
const {
  validateEmail,
  validatePassword,
} = require("../validators/loginValidators");
/* Configurations */
require("dotenv").config();
const secret = process.env.SECRET;
const loginController = express.Router();

loginController.post("/", validateEmail, validatePassword, async (req, res) => {
  try {
    const user = await logInUser(req.body);
    if (user.error) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }
    // console.log(user);
    const token = jwt.sign({ userId: user.id, email: user.email }, secret);
    res.status(200).json({ ...user, token });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error." });
  }
});
/********** */

module.exports = loginController;
