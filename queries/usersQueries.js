// queries/usersQueries.js
const bcrypt = require("bcrypt");
const db = require("../db/dbConfig");

require("dotenv").config();
const SALT = process.env.SALT;

async function getUserByEmail(email) {
  const queryStr = "SELECT * FROM users WHERE email=$1";
  try {
    const user = await db.one(queryStr, [email]);
    return user;
  } catch (err) {
    if (err.name == "QueryResultError" && err.received == 0) {
      return { error: "User Not Found" };
    } else {
      return err;
    }
  }
}

async function createUser(user) {
  const queryStr =
    "INSERT INTO users(email, password, role) VALUES" +
    "($[email], $[password], $[role]) " +
    "RETURNING *";
  user.password = await bcrypt.hash(user.password, SALT);
  try {
    const newUser = await db.one(queryStr, user);
    return newUser;
  } catch (err) {
    return err;
  }
}

module.exports = {
  getUserByEmail,
  createUser,
};
