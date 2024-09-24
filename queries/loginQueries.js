// queries/loginQueries.js
const bcrypt = require("bcrypt");
const db = require("../db/dbConfig");

// FIX THIS
async function logInUser(credentials) {
  let queryStr =
    "SELECT * FROM (" +
    "SELECT id, email, password,  'borrowers' role FROM borrowers " +
    "UNION SELECT id, email, password, 'lenders' role FROM lenders) " +
    "WHERE email=$[email]";
  let user = null;
  try {
    user = await db.oneOrNone(queryStr, credentials);

    if (!user) {
      return { error: "User Not Found." };
    }

    const passwordMatch = await bcrypt.compare(
      credentials.password,
      user.password
    );

    if (!passwordMatch) {
      return { error: "Incorrect Password" };
    }

    if (user.role == "borrowers") {
      queryStr = "SELECT * FROM borrowers WHERE email=$[email]";
    } else {
      queryStr = "SELECT * FROM lenders WHERE email=$[email]";
    }

    data = await db.one(queryStr, user);
    delete data.password;
    return { [user.role.slice(0, -1)]: data };
  } catch (err) {
    return err;
  }
}

module.exports = { logInUser };
