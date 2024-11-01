// queries/borrowersQueries.js
const bcrypt = require("bcrypt");
const db = require("../db/dbConfig.js");
const { createCreditReport } = require("../utils/dataFactories.js");
const {
  offsetDate,
  randomInt,
  getRandomAvatar,
} = require("../utils/helpers.js");
require("dotenv").config();
const SALT = Number(process.env.SALT);

/**
 * Get all borrowers
 * @returns {Array} - List with all borrowers
 */
async function getBorrowers() {
  const queryStr =
    "SELECT borrowers.id, users.id as user_id, users.email, borrowers.city, borrowers.street, borrowers.state, " +
    "borrowers.zip_code, borrowers.phone, borrowers.business_name, borrowers.image_url, borrowers.ein, borrowers.start_date, borrowers.industry " +
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
    "SELECT borrowers.id, users.id as user_id, users.email, borrowers.city, borrowers.street, borrowers.state, borrowers.image_url, " +
    "borrowers.zip_code, borrowers.phone, borrowers.business_name, borrowers.ein, borrowers.start_date, borrowers.industry " +
    "FROM users JOIN borrowers ON users.id = borrowers.user_id " +
    "WHERE borrowers.id=$1";
  try {
    const borrower = await db.one(queryStr, [id]);
    return borrower;
  } catch (err) {
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
  const image_url = await getRandomAvatar(borrower.buiness_name);
  const password_hash = await bcrypt.hash(borrower.password, SALT);
  borrower.password = password_hash;
  const userQuery =
    "INSERT INTO users(email, password, role, last_logged) VALUES" +
    "($[email], $[password], 'borrower', $[last_logged]) " +
    "RETURNING *";
  const borrowerQuery =
    "INSERT INTO borrowers (user_id, city, street, state, zip_code, phone, business_name, image_url, ein, start_date, industry) " +
    "VALUES($[user_id],$[city], $[street], $[state], $[zip_code], $[phone], $[business_name], $[image_url], $[ein], $[start_date], $[industry]) " +
    "RETURNING *";
  const creditReportQuery =
    "INSERT INTO credit_reports ( credit_bureau, report_id, score, created_at, expire_at, borrower_id) " +
    `VALUES ($[credit_bureau], $[report_id], $[score], $[created_at], $[expire_at], $[borrower_id]) RETURNING *`;
  const addToMailListQuery =
    "INSERT INTO mail_list (email, role) " +
    "VALUES($[email], 'borrower') RETURNING *";

  try {
    const data = await db.tx(async (t) => {
      const newUser = await t.one(userQuery, {
        ...borrower,
        last_logged: new Date(),
      });
      const newBorrower = await t.one(borrowerQuery, {
        ...borrower,
        image_url,
        user_id: newUser.id,
      });
      const report = createCreditReport(newBorrower.id, new Date());
      const newReport = await t.one(creditReportQuery, report);
      await t.any(addToMailListQuery, borrower);
      return { newUser, newBorrower, newReport };
    });
    const { newUser, newBorrower, newReport } = data;
    const { id, password } = newUser;
    return {
      password_hash: password,
      email: newUser.email,
      user_id: id,
      ...newBorrower,
      credit_report: newReport,
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
    "UPDATE borrowers SET city=$[city], street=$[street], state=$[state], zip_code=$[zip_code], " +
    "phone=$[phone], business_name=$[business_name], image_url=$[image_url], ein=$[ein], start_date=$[start_date], industry=$[industry] " +
    "WHERE id=$[id] RETURNING *";
  try {
    const data = await db.one(queryStr, { ...borrower, id });
    return data;
  } catch (err) {
    if (err.message.includes("No data returned from the query.")) {
      return { error: "Borrower not Found" };
    } else if (
      err.message.includes("duplicate key value violates unique constraint")
    ) {
      return { error: "Email already in use." };
    } else {
      return err;
    }
  }
}

module.exports = {
  getBorrowers,
  getBorrower,
  createBorrower,
  deleteBorrower,
  updateBorrower,
};
