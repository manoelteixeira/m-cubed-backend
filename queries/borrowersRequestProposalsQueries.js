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

async function getProposal(request_id, id) {
  const queryStr =
    "SELECT * FROM loan_proposals WHERE loan_request_id=$[request_id] AND id=$[id]";
  try {
    const proposal = await db.one(queryStr, {
      request_id: request_id,
      id: id,
    });
    return proposal;
  } catch (err) {
    return err;
  }
}

async function acceptProposal(borrower_id, request_id, proposal_id) {
  const currentDate = new Date();

  const updateRequestQuery =
    "UPDATE loan_requests SET funded_at=$[date], accepted_proposal_id=$[proposal_id] " +
    "WHERE id=$[request_id] AND borrower_id=$[borrower_id] RETURNING *";

  const updateProposals =
    "UPDATE loan_proposals SET " +
    "accepted = CASE WHEN id=$[proposal_id] THEN TRUE ELSE FALSE END " +
    "WHERE loan_request_id=$[request_id] RETURNING *";

  try {
    const data = await db.tx(async (t) => {
      const acceptedRequest = await t.one(updateRequestQuery, {
        date: currentDate,
        proposal_id: proposal_id,
        borrower_id: borrower_id,
        request_id: request_id,
      });
      const updatedProposals = await t.many(updateProposals, {
        proposal_id: proposal_id,
        request_id: request_id,
      });
      return { acceptedRequest, updatedProposals };
    });
    return data;
  } catch (err) {
    return err;
  }
}

module.exports = {
  getProposals,
  getProposal,
  acceptProposal,
};
