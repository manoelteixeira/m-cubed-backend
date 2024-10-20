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
    res.status(400).json({ error: "business_name is required." });
  } else if (typeof req.body.business_name !== "string") {
    res.status(400).json({ error: "business_name must be a string" });
  } else if (req.body.business_name.length == 0) {
    res.status(400).json({ error: "business_name cannot be an empty string." });
  } else {
    next();
  }
}

function validateTitle(req, res, next) {
  if (!req.body.title) {
    res.status(400).json({ error: "title is required" });
  } else if (typeof req.body.title != "string") {
    res.status(400).json({ error: "title must be a string" });
  } else if (req.body.title.lenght == 0) {
    res.status(400).json({ error: "title must not be an empty string." });
  } else {
    next();
  }
}

function validateDescription(req, res, next) {
  if (!req.body.description) {
    res.status(400).json({ error: "description is required" });
  } else if (typeof req.body.description != "string") {
    res.status(400).json({ error: "description must be a string" });
  } else if (req.body.description.lenght == 0) {
    res.status(400).json({ error: "description must not be an empty string." });
  } else {
    next();
  }
}

function validateCreatedAt(req, res, next) {
  if (!req.body.created_at) {
    res.status(400).json({ error: "created_at is required" });
  } else if (typeof req.body.created_at != "string") {
    res.status(400).json({ error: "created_at must be a string" });
  } else if (new Date(req.body.created_at) == "Invalid Date") {
    res.status(400).json({ error: "Invalid date." });
  } else {
    next();
  }
}

function validateExpireAt(req, res, next) {
  if (!req.body.expire_at) {
    res.status(400).json({ error: "expire_at is required" });
  } else if (typeof req.body.expire_at != "string") {
    res.status(400).json({ error: "expire_at must be a string" });
  } else if (new Date(req.body.expire_at) == "Invalid Date") {
    res.status(400).json({ error: "Invalid date." });
  } else if (new Date(req.body.expire_at) - new Date(req.body.created_at) < 0) {
    res
      .status(400)
      .json({
        error: "Invalid date. expire_at must be an date after created_at",
      });
  } else {
    next();
  }
}

module.exports = {
  validateEmail,
  validatePassword,
  validateBusinessName,
  validateTitle,
  validateDescription,
  validateCreatedAt,
  validateExpireAt,
};
