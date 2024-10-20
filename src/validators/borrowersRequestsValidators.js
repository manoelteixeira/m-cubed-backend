// validators/borrowersRequestsValidators.js

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

module.exports = {
  validateValue,
};
