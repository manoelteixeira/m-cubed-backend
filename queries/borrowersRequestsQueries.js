// queries/borrowersRequestsQueries.js
const db = require("../db/dbConfig.js");

/**
 * Get All requests for a given borrower id
 * @param {*} id
 * @returns {Array} - All request from the fiven borrower
 */
async function getRequests(id) {
  const queryStr = "SELECT * FROM loan_requests WHERE borrower_id=$[id]";
  try {
    const requests = await db.any(queryStr, { id: id });
    return requests;
  } catch (err) {
    return err;
  }
}

/**
 * Get an specific loan request for a given borrower
 * @param {Number} borrower_id
 * @param {Number} id
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
 * @param {Number} borrower_id
 * @param {Number} id
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
  const queryStr =
    "INSERT INTO loan_requests(title, description, value, created_at, borrower_id) " +
    "VALUES ($[title], $[description], $[value], $[created_at], $[borrower_id]) " +
    "RETURNING *";
  try {
    const newRequest = await db.one(queryStr, request);
    return newRequest;
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
  const queryStr =
    "UPDATE loan_requests " +
    "SET title=$[title], description=$[description], value=$[value] " +
    "WHERE borrower_id=$[borrower_id] AND id=$[id] " +
    "RETURNING *";
  try {
    const updatedRequest = await db.one(queryStr, request);
    return updatedRequest;
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
