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

function validateAccepted(req, res, next) {
  // "accepted" is optional, so check only if it is provided
  if (
    req.body.accepted !== undefined &&
    typeof req.body.accepted !== "boolean"
  ) {
    res
      .status(400)
      .json({ error: "The 'accepted' field must be true, false, or null." });
  } else {
    next();
  }
}

module.exports = {
  validateTitle,
  validateDescription,
  validateCreatedAt,
  validateAccepted,
};
