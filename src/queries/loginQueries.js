// queries/loginQueries.js
const bcrypt = require("bcrypt");
const db = require("../db/dbConfig");

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
  const updateUserQuery =
    "UPDATE users SET last_logged=$[date] WHERE id=$[id] RETURNING *";
  try {
    let data;
    let user = await db.oneOrNone(queryStr, credentials);
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
    // Update Last Logged
    const date = new Date();
    user = await db.oneOrNone(updateUserQuery, {
      date: date.toISOString(),
      id: user.id,
    });

    if (!user) {
      return { error: "Something went wrong." };
    }

    // Create Return Response
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
