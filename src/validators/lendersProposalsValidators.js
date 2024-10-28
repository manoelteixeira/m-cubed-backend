// validators/loanProposalsValidators.js

function validateLoanAmount(req, res, next) {
  if (!req.body.loan_amount) {
    res.status(400).json({ error: "loan_amount is required" });
  } else if (typeof req.body.loan_amount !== "number") {
    res.status(400).json({ error: "loan_amount must be a number" });
  } else if (req.body.loan_amount < 0) {
    res.status(400).json({ error: "loan_amount must be a positive number" });
  } else {
    next();
  }
}

function validateInterestRate(req, res, next) {
  if (!req.body.interest_rate) {
    res.status(400).json({ error: "interest_rate is required" });
  } else if (typeof req.body.interest_rate !== "number") {
    res.status(400).json({ error: "interest_rate must be a number" });
  } else if (req.body.interest_rate < 0) {
    res.status(400).json({ error: "interest_rate must be a positive number" });
  } else {
    next();
  }
}

function validateRepaymentTerm(req, res, next) {
  if (!req.body.repayment_term) {
    res.status(400).json({ error: "repayment_term is required" });
  } else if (typeof req.body.repayment_term !== "number") {
    res.status(400).json({ error: "repayment_term must be a number" });
  } else if (req.body.repayment_term < 0) {
    res.status(400).json({ error: "repayment_term must be a positive number" });
  } else {
    next();
  }
}

function validateRequirements(req, res, next) {
  const checkRequirements = (arr) =>
    arr.filter((item) => typeof item !== "string").length == 0;

  const requirements = req.body.requirements;

  if (!requirements) {
    res.status(400).json({ error: "requirements is required" });
  } else if (!Array.isArray(requirements)) {
    res.status(400).json({ error: "requirements must be an array" });
  } else if (requirements.length > 0 && !checkRequirements(requirements)) {
    res
      .status(400)
      .json({ error: "requirements array must olny contain strings" });
  } else {
    next();
  }
}

function validateQuerySort(req, res, next) {
  const validSorts = [
    "title",
    "value",
    "created_at",
    "industry",
    "state",
    "credit_score",
    "description",
  ];
  if (req.query.sort && !validSorts.includes(req.query.sort)) {
    res.status(400).json({
      error: { message: "Invalid sort value", valid_values: validSorts },
    });
  } else {
    next();
  }
}

function validateQueryOrder(req, res, next) {
  const validOrder = ["asc", "desc"];
  if (req.query.order && !validOrder.includes(req.query.order)) {
    res.status(400).json({
      error: { message: "Invalid order value", valid_values: validOrder },
    });
  } else {
    next();
  }
}

function validateQueryLimit(req, res, next) {
  if (req.query.limit && isNaN(req.query.limit)) {
    res.status(400).json({ error: "limit must me a number." });
  } else {
    next();
  }
}

function validateQueryOffset(req, res, next) {
  if (req.query.offset && isNaN(req.query.offset)) {
    res.status(400).json({ error: "offset must me a number." });
  } else {
    next();
  }
}

function validateHide(req, res, next) {
  if (req.body.hide == undefined) {
    res.status(400).json({ error: "hide is required." });
  } else if (typeof req.body.hide !== "boolean") {
    res.status(400).json({ error: "hide must be a boolean value." });
  } else {
    next();
  }
}

function validateFavorite(req, res, next) {
  if (req.body.favorite == undefined) {
    res.status(400).json({ error: "favorite is required." });
  } else if (typeof req.body.favorite !== "boolean") {
    res.status(400).json({ error: "favorite must be a boolean value." });
  } else {
    next();
  }
}

module.exports = {
  validateLoanAmount,
  validateInterestRate,
  validateRepaymentTerm,
  validateRequirements,
  validateQuerySort,
  validateQueryOrder,
  validateQueryLimit,
  validateQueryOffset,
  validateHide,
  validateFavorite,
};
