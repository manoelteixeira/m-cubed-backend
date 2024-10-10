// queries/borrowersQueries.js
const bcrypt = require("bcrypt");
const db = require("../db/dbConfig.js");
require("dotenv").config();
const SALT = Number(process.env.SALT);

/**
 * Get all borrowers
 * @returns {Array} - List with all borrowers
 */
async function getBorrowers() {
  const queryStr =
    "SELECT borrowers.id, users.id as user_id, users.email, borrowers.city, borrowers.street, borrowers.state, " +
    "borrowers.zip_code, borrowers.phone, borrowers.business_name, borrowers.credit_score, borrowers.start_date, borrowers.industry " +
    "FROM users JOIN borrowers ON users.id = borrowers.user_id";
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
  // const queryStr = "SELECT * FROM borrowers WHERE id=$[id]";
  const queryStr =
    "SELECT borrowers.id, users.id as user_id, users.email, borrowers.city, borrowers.street, borrowers.state, " +
    "borrowers.zip_code, borrowers.phone, borrowers.business_name, borrowers.credit_score, borrowers.start_date, borrowers.industry " +
    "FROM users JOIN borrowers ON users.id = borrowers.user_id " +
    "WHERE borrowers.id=$1";
  try {
    const borrower = await db.one(queryStr, [id]);
    return borrower;
  } catch (err) {
    console.log(err);
    if (err.message == "No data returned from the query.") {
      return { error: "Borrower not found." };
    } else {
      return err;
    }
  }
}

/**
 * Delete Borrower
 * @param {*} id
 * @returns {Object} - Deleted borrower object
 */
async function deleteBorrower(id) {
  const borrowerQuery = "SELECT * FROM borrowers WHERE id=$1";
  const deleteUserQuery = "DELETE from users WHERE id=$1 RETURNING *";
  try {
    const data = await db.tx(async (t) => {
      const borrower = await t.one(borrowerQuery, [id]);

      const user = await t.one(deleteUserQuery, borrower.user_id);
      return { borrower, user };
    });
    const { borrower, user } = data;
    const user_id = user.id;
    delete user.id;
    delete user.role;
    return {
      user_id,
      ...user,
      ...borrower,
    };
  } catch (err) {
    if (err.message == "No data returned from the query.") {
      return { error: "Borrower not found." };
    } else {
      return err;
    }
  }
}

/**
 * Create a new Borrower
 * @param {Object} borrower
 * @returns {Object} - New borrower
 */
async function createBorrower(borrower) {
  const password_hash = await bcrypt.hash(borrower.password, SALT);
  borrower.password = password_hash;
  const userQuery =
    "INSERT INTO users(email, password, role) VALUES" +
    "($[email], $[password], 'borrower') " +
    "RETURNING *";
  const borrowerQuery =
    "INSERT INTO borrowers (user_id, city, street, state, zip_code, phone, business_name, credit_score, start_date, industry) " +
    "VALUES($[user_id],$[city], $[street], $[state], $[zip_code], $[phone], $[business_name], $[credit_score], $[start_date], $[industry]) " +
    "RETURNING *";

  try {
    const data = await db.tx(async (t) => {
      const newUser = await t.one(userQuery, borrower);
      const newBorrower = await t.one(borrowerQuery, {
        ...borrower,
        user_id: newUser.id,
      });
      return { newUser, newBorrower };
    });
    const { newUser, newBorrower } = data;
    const { id, password } = newUser;
    return {
      password_hash: password,
      email: newUser.email,
      user_id: id,
      ...newBorrower,
    };
  } catch (err) {
    if (err.detail.includes("email") && err.detail.includes("already exists"))
      return { error: "Email already exists." };
    else {
      return err;
    }
  }
}

async function updateBorrower(id, borrower) {
  const queryStr =
    "UPDATE borrowers " +
    "SET email=$[email], city=$[city], street=$[street], state=$[state], zip_code=$[zip_code], phone=$[phone], business_name=$[business_name], credit_score=$[credit_score], start_date=$[start_date], industry=$[industry] " +
    "WHERE id=$[id] RETURNING *";
  try {
    const updatedBorrower = await db.one(queryStr, { ...borrower, id: id });
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
