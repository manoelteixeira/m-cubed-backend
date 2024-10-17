// validators/lendersValidators.js

function validateEmail(req, res, next) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/g;
  if (!req.body.email) {
    res.status(400).json({ error: "Please provide an email address." });
  } else if (typeof req.body.email !== "string") {
    res.status(400).json({ error: "Email should be a valid string." });
  } else if (req.body.email.length === 0) {
    res.status(400).json({ error: "Email field cannot be left empty." });
  } else if (req.body.email.length > 140) {
    res
      .status(400)
      .json({ error: "Email is too long! Maximum length is 140 characters." });
  } else if (!emailPattern.test(req.body.email)) {
    res.status(400).json({
      error: "Oops! The email format seems incorrect. Please try again.",
    });
  } else {
    next();
  }
}

function validatePassword(req, res, next) {
  if (!req.body.password) {
    res.status(400).json({ error: "Please enter a password." });
  } else if (typeof req.body.password !== "string") {
    res.status(400).json({ error: "Password must be a valid string." });
  } else if (req.body.password.length === 0) {
    res.status(400).json({ error: "Password field cannot be empty." });
  } else if (req.body.password.length > 140) {
    res.status(400).json({
      error: "Password is too long! Maximum length is 140 characters.",
    });
  } else {
    next();
  }
}

function validateBusinessName(req, res, next) {
  if (!req.body.business_name) {
    res
      .status(400)
      .json({ error: "Please provide the name of your business." });
  } else if (typeof req.body.business_name !== "string") {
    res.status(400).json({ error: "Business name must be a valid string." });
  } else if (req.body.business_name.length === 0) {
    res.status(400).json({ error: "Business name cannot be empty." });
  } else {
    next();
  }
}

module.exports = {
  validateEmail,
  validatePassword,
  validateBusinessName,
};
