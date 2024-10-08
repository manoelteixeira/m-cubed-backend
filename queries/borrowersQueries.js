// queries/borrowersQueries.js
const bcrypt = require("bcrypt");
const db = require("../db/dbConfig.js");
// require("dotenv").config();
// const SALT = process.env.SALT;

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
  const queryStr = "SELECT * FROM borrowers WHERE id=$[id]";
  try {
    const borrower = await db.one(queryStr, { id: id });
    return borrower;
  } catch (err) {
    return err;
  }
}

/**
 * Delete Borrower
 * @param {*} id
 * @returns {Object} - Deleted borrower object
 */
async function deleteBorrower(id) {
  const queryStr = "DELETE FROM borrowers WHERE id=$[id] RETURNING *;";
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
  // const { password } = borrower;
  // const hash = await bcrypt.hash(password, SALT);
  // borrower.password = hash;
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

async function updateBorrower(id, borrower) {
  const queryStr =
    "UPDATE borrowers " +
    "SET email=$[email], city=$[city], street=$[street], state=$[state], zip_code=$[zip_code], phone=$[phone], business_name=$[business_name], credit_score=$[credit_score], start_date=$[start_date], industry=$[industry] " +
    "WHERE id=$[id] RETURNING *";
  try {
    const updatedBorrower = await db.one(queryStr, { ...borrower, id: id });
    console.log(updatedBorrower);
    return updatedBorrower;
  } catch (err) {
    return err;
  }
}

module.exports = {
  getBorrowers,
  getBorrower,
  createBorrower,
  deleteBorrower,
  updateBorrower,
};
