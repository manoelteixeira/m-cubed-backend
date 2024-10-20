// validators/borrowersRequestsValidators.js

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
function validateValue(req, res, next) {
  if (!req.body.value) {
    res.status(400).json({ error: "value is required" });
  } else if (typeof req.body.value != "number") {
    res.status(400).json({ error: "value must be a number" });
  } else if (req.body.value < 2000) {
    res.status(400).json({ error: "value must be higher than $2000" });
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
  } else {
    next();
  }
}

module.exports = {
  validateTitle,
  validateDescription,
  validateValue,
  validateCreatedAt,
  validateExpireAt,
};
