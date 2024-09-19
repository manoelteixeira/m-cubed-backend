// queries/borrowersQueries.js
const db = require("../db/dbConfig.js");

/**
 * Get all borrowes
 * @returns {Array} - List with all borrowers
 */
async function getBorrowers() {
  const queryStr = "SELECT * FROM borrowers";
  try {
    const borrowers = await db.any(queryStr);

    return borrowers;
  } catch (err) {
    return err;
  }
}

/**
 * Get a single borrower
 * @param {*} id
 * @returns {Object} - Borrower Object
 */
async function getBorrower(id) {
  const queryStr =
    "SELECT id, email, city, street, state, zip_code, phone, business_name, credit_score, start_date, industry " +
    "FROM borrowers WHERE id=$[id]";
  try {
    const borrower = await db.one(queryStr, { id: id });
    return borrower;
  } catch (err) {
    return err;
  }
}

/**
 * Create a new Borrower
 * @param {Object} borrower
 * @returns {Object} - New borrower
 */
async function createBorrower(borrower) {
  const queryStr =
    "INSERT INTO borrowers (email, password, city, street, state, zip_code, phone, business_name, credit_score, start_date, industry) " +
    "VALUES($[email], $[password], $[city], $[street], $[state], $[zip_code], $[phone], $[business_name], $[credit_score], $[start_date], $[industry]) " +
    "RETURNING *";
  try {
    const newBorrower = await db.one(queryStr, borrower);
    return newBorrower;
  } catch (err) {
    return err;
  }
}

module.exports = { getBorrowers, getBorrower, createBorrower };
