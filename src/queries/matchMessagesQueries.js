// src/queries/matchMessagesQueries.js
const db = require("../db/dbConfig.js");

async function getAllMessages() {
  const queryStr = "SELECT * FROM loan_match_messages";
  try {
    const messages = await db.manyOrNone(queryStr);
    return messages;
  } catch (err) {
    return err;
  }
}

async function getMessages(id) {
  const queryStr =
    "SELECT * FROM messages WHERE loan_proposal_id=$[id] ORDER BY created_at asc";
  try {
    const messages = await db.manyOrNone(queryStr, { id });
    return messages;
  } catch (err) {
    return err;
  }
}

async function newMessage(message) {
  const statusQuery =
    "SELECT lp.id, lp.status AS proposal_status, lr.status AS request_status " +
    "FROM loan_proposals AS lp join loan_requests AS lr " +
    "ON lp.loan_request_id=lr.id  " +
    "WHERE lp.id=$[id]";
  const messageQuery =
    "INSERT INTO loan_match_messages(loan_proposal_id, sender, created_at, message) " +
    "VALUES ($[id], $[sender], $[timestamp], $[message]) RETURNING *";
  try {
    const status = await db.one(statusQuery, message);
    const { proposal_status, request_status } = status;
    if (proposal_status != request_status || proposal_status != "active") {
      throw { message: "This proposal is not active yet." };
    }
    const timestamp = new Date();
    const data = await db.one(messageQuery, { ...message, timestamp });
    return data;
  } catch (err) {
    if (err?.received == 0) {
      throw { error: "Proposal Not Found" };
    } else if (err.message) {
      throw { error: err.message };
    } else {
      throw { error: "Something went wrong." };
    }
  }
}

module.exports = { getAllMessages, getMessages, newMessage };
