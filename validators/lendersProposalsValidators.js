// validators/loanProposalsValidators.js

function validateTitle(req, res, next) {
  if (!req.body.title) {
    res
      .status(400)
      .json({ error: "Please provide a title for the loan proposal." });
  } else if (typeof req.body.title !== "string") {
    res.status(400).json({ error: "The title must be a valid string." });
  } else if (req.body.title.length === 0) {
    res.status(400).json({ error: "The title cannot be an empty string." });
  } else if (req.body.title.length > 140) {
    res.status(400).json({
      error: "The title is too long! Maximum length is 140 characters.",
    });
  } else {
    next();
  }
}

function validateDescription(req, res, next) {
  if (!req.body.description) {
    res
      .status(400)
      .json({ error: "Please provide a description for the loan proposal." });
  } else if (typeof req.body.description !== "string") {
    res.status(400).json({ error: "The description must be a valid string." });
  } else if (req.body.description.length === 0) {
    res.status(400).json({ error: "The description cannot be empty." });
  } else {
    next();
  }
}

function validateCreatedAt(req, res, next) {
  if (!req.body.created_at) {
    res.status(400).json({ error: "Please provide the creation date." });
  } else if (typeof req.body.created_at !== "string") {
    res
      .status(400)
      .json({ error: "The creation date must be a valid string." });
  } else if (isNaN(new Date(req.body.created_at))) {
    res.status(400).json({
      error: "Invalid date format. Please provide a valid date (YYYY-MM-DD).",
    });
  } else {
    next();
  }
}

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

function validateQuerySortParam(req, res, next) {
  const validSorts = [
    "title",
    "value",
    "created_at",
    "industry",
    "state",
    "credit_score",
  ];
  if (req.query.sort && !validSorts.includes(req.query.sort)) {
    res.status(400).json({
      error:
        "sort can only be: title, value, created_at, industry, state or credit_score",
    });
  } else {
    next();
  }
}

function validateQueryOrderParam(req, res, next) {}

module.exports = {
  validateTitle,
  validateDescription,
  validateCreatedAt,
  validateLoanAmount,
  validateInterestRate,
  validateRepaymentTerm,
  validateQuerySortParam,
  validateQueryOrderParam,
};
