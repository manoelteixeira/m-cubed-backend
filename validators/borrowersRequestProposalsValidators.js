// validators/requestProposalsValidators.js

function validateProposalID(req, res, next) {
  if (!req.body.proposal_id) {
    res.status(400).json({ error: "proposal_id is required." });
  } else if (typeof req.body.proposal_id !== "number") {
    res.status(400).json({ error: "proposal_id must be an integer." });
  } else {
    next();
  }
}

module.exports = { validateProposalID };
