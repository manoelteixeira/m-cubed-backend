// queries/borrowersRequestProposalsQueries.js
const db = require("../db/dbConfig.js");

async function getProposals(id) {
  const queryStr = "SELECT * FROM loan_proposals WHERE loan_request_id=$[id]";
  try {
    const proposals = await db.any(queryStr, { id: id });
    return proposals;
  } catch (err) {
    return err;
  }
}

module.exports = {
  getProposals,
};
