// queries/loginQueries.js
const bcrypt = require("bcrypt");
const db = require("../db/dbConfig");
const { da } = require("@faker-js/faker");

async function getUsers() {
  const queryStr = "SELECT * FROM users";
  try {
    const users = await db.many(queryStr);
    return users;
  } catch (err) {
    return err;
  }
}

async function logInUser(credentials) {
  const queryStr = "SELECT * FROM users WHERE email=$[email]";
  const borrowerQuery = "SELECT * FROM borrowers WHERE user_id=$[id]";
  const lenderQuery = "SELECT * FROM lenders WHERE user_id=$[id]";
  try {
    let data;
    const user = await db.oneOrNone(queryStr, credentials);
    // Validate User
    if (!user) {
      return { error: "User Not Found" };
    }
    // Validate Password
    const passwordMatch = await bcrypt.compare(
      credentials.password,
      user.password
    );
    if (!passwordMatch) {
      return { error: "Incorrect Password" };
    }
    // Create Return Respons
    const role = user.role;
    if (role == "lender") {
      data = await db.oneOrNone(lenderQuery, user);
    } else {
      data = await db.oneOrNone(borrowerQuery, user);
    }

    delete data.user_id;
    delete user.id;
    delete user.role;
    delete user.password;

    return role == "lender"
      ? { lender: { ...data, ...user } }
      : { borrower: { ...data, ...user } };
  } catch (err) {
    return err;
  }
}

module.exports = { logInUser, getUsers };
