// src/validators/matchMessagesValidators.js

function validateSender(req, res, next) {
  if (!req.body.sender) {
    res.status(400).json({ error: "sender is required" });
  } else if (typeof req.body.sender !== "string") {
    res.status(400).json({ error: "sender must me a string" });
  } else if (req.body.sender.length <= 0) {
    res.status(400).json({ error: "sender cant be an emptry string" });
  } else {
    next();
  }
}
function validateMessage(req, res, next) {
  if (!req.body.message) {
    res.status(400).json({ error: "message is required" });
  } else if (typeof req.body.message !== "string") {
    res.status(400).json({ error: "message must me a string" });
  } else if (req.body.message.length <= 0) {
    res.status(400).json({ error: "message cant be an emptry string" });
  } else {
    next();
  }
}

module.exports = {
  validateSender,
  validateMessage,
};
