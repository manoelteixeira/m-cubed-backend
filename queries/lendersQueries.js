const bcrypt = require("bcrypt");
const db = require("../db/dbConfig.js");
require("dotenv").config();
const SALT = Number(process.env.SALT);

/**
 * Get all lenders
 * @returns {Array} - List of All lenders
 */
const getAllLenders = async () => {
  const queryStr =
    "SELECT lenders.id, users.id as user_id, users.email, lenders.business_name " +
    "FROM users JOIN lenders ON users.id = lenders.user_id";
  try {
    const allLenders = await db.any(queryStr);
    return allLenders;
  } catch (error) {
    return error;
  }
};

// Get a specific lender by ID
const getLender = async (id) => {
  const queryStr =
    "SELECT users.id, users.email, lenders.business_name, lenders.id as lender_id " +
    "FROM users JOIN lenders ON users.id = lenders.user_id " +
    "WHERE lenders.id=$1";
  try {
    const oneLender = await db.one(queryStr, [id]);
    return oneLender;
  } catch (err) {
    console.log(err.message);
    if (err.message == "No data returned from the query.") {
      return { error: "Lender not found." };
    } else {
      return err;
    }
  }
};

/**
 * Create New Lender
 * @param {Object} lender
 * @returns {Object} - New Lender
 */
async function createLender(lender) {
  const { email, password, business_name } = lender;
  const password_hash = await bcrypt.hash(password, SALT);
  const userQuery =
    "INSERT INTO users(email, password, role) VALUES" +
    "($[email], $[password], 'lender') " +
    "RETURNING *";
  const lenderQuery =
    "INSERT INTO lenders(business_name, user_id) VALUES" +
    "($[business_name], $[user_id]) " +
    "RETURNING *";
  try {
    const data = await db.tx(async (t) => {
      const newUser = await t.one(userQuery, {
        email,
        password: password_hash,
      });
      const newLender = await t.one(lenderQuery, {
        business_name,
        user_id: newUser.id,
      });
      return { newUser, newLender };
    });
    return {
      user_id: data.newUser.id,
      id: data.newLender.id,
      email: data.newUser.email,
      business_name: data.newLender.business_name,
      password_hash: data.newUser.password,
    };
  } catch (err) {
    if (err.detail.includes("email") && err.detail.includes("already exists"))
      return { error: "Email already exists." };
    else {
      return err;
    }
  }
}

/**
 * Delete Lender
 * @param {String} id - Lender ID
 * @returns
 */
async function deleteLender(id) {
  const lenderQuery = "SELECT * FROM lenders WHERE id=$1";
  const deleteLenderQuery = "DELETE from users WHERE id=$1 RETURNING *";
  try {
    const data = await db.tx(async (t) => {
      const lender = await t.one(lenderQuery, [id]);
      const user = await t.one(deleteLenderQuery, [lender.user_id]);
      return { lender, user };
    });
    const { lender, user } = data;
    const user_id = user.id;
    delete user.id;
    delete user.role;
    return {
      user_id,
      ...user,
      ...lender,
    };
  } catch (err) {
    if (err.message == "No data returned from the query.") {
      return { error: "Lender not found." };
    } else {
      return err;
    }
  }
}

// Update a lender by ID
// const updateLender = async (id, lender) => {
//   const queryStr =
//     "UPDATE lenders " +
//     "SET email = $[email], business_name = $[business_name] " +
//     "WHERE id = $[id] RETURNING * ";

//   try {
//     const updatedLender = await db.one(queryStr, { ...lender, id });

//     return updatedLender;
//   } catch (error) {
//     return error;
//   }
// };
async function updateLender(id, lender) {
  const updateLenderQuery =
    "UPDATE lenders SET business_name=$[business_name] WHERE id=$[id] RETURNING *";
  const updateUserQuery =
    "UPDATE borrowers SET email=$[email], password=$[password] WHERE id=$[id] RETURNING *";
}

module.exports = {
  getAllLenders,
  getLender,
  createLender,
  deleteLender,
  updateLender,
};
