const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;

function validateEmail(req, res, next) {
  if (!req.body.email) {
    res.status(400).json({ error: "email is required" });
  } else if (typeof req.body.email !== "string") {
    res.status(400).json({ error: "email must be a string" });
  } else {
    next();
  }
}
function validatePassword(req, res, next) {
  if (!req.body.password) {
    res.status(400).json({ error: "password is required" });
  } else if (typeof req.body.password !== "string") {
    res.status(400).json({ error: "password must be a string" });
  } else {
    next();
  }
}

function authenticateToken(req, res, next) {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ error: "Access Denied. No token provided" });
  }
  jwt.verify(token, secret, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token." });
    req.user = user;
    next();
  });
}

module.exports = {
  validateEmail,
  validatePassword,
  authenticateToken,
};
