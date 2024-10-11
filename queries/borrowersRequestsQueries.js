// queries/borrowersRequestsQueries.js
const db = require("../db/dbConfig.js");

/**
 * Get All requests for a given borrower id
 * @param {*} id
 * @returns {Array} - All request from the fiven borrower
 */
async function getRequests(id) {
  const queryStr =
    "SELECT loan_requests.id, loan_requests.title, loan_requests.description, " +
    "loan_requests.value, loan_requests.created_at, loan_requests.funded_at, " +
    "loan_requests.accepted_proposal_id, loan_requests.borrower_id, " +
    "COUNT(loan_proposals.loan_request_id) as proposals " +
    "FROM loan_requests JOIN loan_proposals " +
    "ON loan_requests.id = loan_proposals.loan_request_id " +
    "WHERE borrower_id=$[id] " +
    "GROUP BY loan_requests.id " +
    "ORDER BY created_at DESC";
  try {
    const requests = await db.any(queryStr, { id: id });
    console.log(requests);
    return requests;
  } catch (err) {
    console.log("err:", err);
    return err;
  }
}

/**
 * Get an specific loan request for a given borrower
 * @param {String} borrower_id
 * @param {Strin} id
 * @returns {Object} - Loan Request Object
 */
async function getRequest(borrower_id, id) {
  const queryStr =
    "SELECT * FROM loan_requests WHERE borrower_id=$[borrower_id] AND id=$[id]";
  try {
    const request = await db.one(queryStr, {
      borrower_id: borrower_id,
      id: id,
    });
    return request;
  } catch (err) {
    return err;
  }
}

/**
 * Delete an specific loan request for a given borrower
 * @param {Strin} borrower_id
 * @param {String} id
 * @returns {Object} - Loan Request Object
 */
async function deleteRequest(borrower_id, id) {
  const queryStr =
    "DELETE FROM loan_requests WHERE borrower_id=$[borrower_id] AND id=$[id] RETURNING *;";
  try {
    const borrower = await db.one(queryStr, {
      borrower_id: borrower_id,
      id: id,
    });
    return borrower;
  } catch (err) {
    return err;
  }
}

/**
 * Create a new loan request
 * @param {*} request
 * @returns {Object} - Loan Request Object
 */
async function createRequest(request) {
  const totalRequestsQuery =
    "SELECT SUM(value) FROM loan_requests " +
    "WHERE borrower_id=$[borrower_id] AND funded_at is NULL AND accepted_proposal_id is NULL";

  const requestQuery =
    "INSERT INTO loan_requests(title, description, value, created_at, borrower_id) " +
    "VALUES ($[title], $[description], $[value], $[created_at], $[borrower_id]) " +
    "RETURNING *";
  try {
    const totalRequestsValue = await db.one(totalRequestsQuery, request);
    const sum = totalRequestsValue.sum + request.value;
    if (sum > 250000) {
      return { error: "Maximum Request Value exceeded" };
    } else {
      const newRequest = await db.one(requestQuery, request);
      return newRequest;
    }
  } catch (err) {
    return err;
  }
}

/**
 * Update a loan request
 * @param {*} request
 * @returns {Object} - Loan Request Object
 */
async function updateRequest(request) {
  const requestQuery = "SELECT * FROM loan_requests WHERE id=$[id]";
  const updatedRequestQuery =
    "UPDATE loan_requests " +
    "SET title=$[title], description=$[description], value=$[value] " +
    "WHERE borrower_id=$[borrower_id] AND id=$[id] " +
    "RETURNING *";
  try {
    const requestData = await db.one(requestQuery, { id: request.id });
    if (!requestData.funded_at && !request.accepted_proposal_id) {
      const updatedRequest = await db.one(queryStr, request);
      return updatedRequest;
    } else {
      return { error: "Loan request can no longer be updated." };
    }
  } catch (err) {
    return err;
  }
}

module.exports = {
  getRequests,
  getRequest,
  deleteRequest,
  createRequest,
  updateRequest,
};
