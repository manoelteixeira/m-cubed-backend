// validators/borrowersValidators.js

function validateEmail(req, res, next) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/g;
  if (!req.body.email) {
    res.status(400).json({ error: "email is required." });
  } else if (typeof req.body.email !== "string") {
    res.status(400).json({ error: "email must be a string" });
  } else if (req.body.email.length == 0) {
    res.status(400).json({ error: "email cannot be an empty string." });
  } else if (req.body.email.length > 140) {
    res.status(400).json({ error: "email exceeds 140 characters." });
  } else if (!emailPattern.test(req.body.email)) {
    res.status(400).json({ error: "Invalid email." });
  } else {
    next();
  }
}

function validatePassword(req, res, next) {
  if (!req.body.password) {
    res.status(400).json({ error: "password is required." });
  } else if (typeof req.body.password !== "string") {
    res.status(400).json({ error: "password must be a string" });
  } else if (req.body.password.length == 0) {
    res.status(400).json({ error: "password cannot be an empty string." });
  } else if (req.body.password.length > 140) {
    res.status(400).json({ error: "password exceeds 140 characters." });
  } else {
    next();
  }
}

function validateCity(req, res, next) {
  if (!req.body.city) {
    res.status(400).json({ error: "city is required." });
  } else if (typeof req.body.city !== "string") {
    res.status(400).json({ error: "city must be a string" });
  } else if (req.body.city.length == 0) {
    res.status(400).json({ error: "city cannot be an empty string." });
  } else if (req.body.city.length > 100) {
    res.status(400).json({ error: "city exceeds 100 characters." });
  } else {
    next();
  }
}

function validateStreet(req, res, next) {
  if (!req.body.street) {
    res.status(400).json({ error: "street is required." });
  } else if (typeof req.body.street !== "string") {
    res.status(400).json({ error: "street must be a string" });
  } else if (req.body.street.length == 0) {
    res.status(400).json({ error: "street cannot be an empty string." });
  } else if (req.body.street.length > 100) {
    res.status(400).json({ error: "street exceeds 100 characters." });
  } else {
    next();
  }
}

function validateState(req, res, next) {
  if (!req.body.state) {
    res.status(400).json({ error: "state is required." });
  } else if (typeof req.body.state !== "string") {
    res.status(400).json({ error: "state must be a string" });
  } else if (req.body.state.length == 0) {
    res.status(400).json({ error: "state cannot be an empty string." });
  } else if (req.body.state.length > 100) {
    res.status(400).json({ error: "state exceeds 100 characters." });
  } else {
    next();
  }
}

function validateZipCode(req, res, next) {
  const zipCodePattern = /^\d{5}(-\d{4})?(?!-)$/g;
  if (!req.body.zip_code) {
    res.status(400).json({ error: "zip_code is required." });
  } else if (typeof req.body.zip_code !== "string") {
    res.status(400).json({ error: "zip_code must be a string" });
  } else if (req.body.zip_code.length == 0) {
    res.status(400).json({ error: "zip_code cannot be an empty string." });
  } else if (req.body.zip_code.length > 11) {
    res.status(400).json({ error: "zip_code exceeds 11 characters." });
  } else if (zipCodePattern.test(req.body.zip_code)) {
    res.status(400).json({ error: "Invalid zip_code." });
  } else {
    next();
  }
}

function validatePhone(req, res, next) {
  if (!req.body.phone) {
    res.status(400).json({ error: "phone is required." });
  } else if (typeof req.body.phone !== "string") {
    res.status(400).json({ error: "phone must be a string" });
  } else if (req.body.phone.length == 0) {
    res.status(400).json({ error: "phone cannot be an empty string." });
  } else {
    next();
  }
}

function validateBusinessName(req, res, next) {
  if (!req.body.business_name) {
    res.status(400).json({ error: "business_name is required." });
  } else if (typeof req.body.business_name !== "string") {
    res.status(400).json({ error: "business_name must be a string" });
  } else if (req.body.business_name.length == 0) {
    res.status(400).json({ error: "business_name cannot be an empty string." });
  } else {
    next();
  }
}

function validateCreditScore(req, res, next) {
  if (!req.body.credit_score) {
    res.status(400).json({ error: "credit_score is required." });
  } else if (typeof req.body.credit_score !== "number") {
    res.status(400).json({ error: "credit_score must be a number" });
  } else {
    next();
  }
}

function validateStartDate(req, res, next) {
  if (!req.body.start_date) {
    res.status(400).json({ error: "start_date is required." });
  } else if (typeof req.body.start_date !== "string") {
    res.status(400).json({ error: "start_date must be a string" });
  } else if (req.body.start_date.length == 0) {
    res.status(400).json({ error: "start_date cannot be an empty string." });
  } else if (new Date(req.body.start_date) == "Invalid Date") {
    res.status(400).json({ error: "Invalid date." });
  } else {
    next();
  }
}

function validateIndustry(req, res, next) {
  if (!req.body.industry) {
    res.status(400).json({ error: "industry is required." });
  } else if (typeof req.body.industry !== "string") {
    res.status(400).json({ error: "industry must be a string" });
  } else if (req.body.industry.length == 0) {
    res.status(400).json({ error: "industry cannot be an empty string." });
  } else {
    next();
  }
}

module.exports = {
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
};
