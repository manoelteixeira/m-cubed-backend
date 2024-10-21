// src/queries/mailListQueries.js
const db = require("../db/dbConfig.js");

async function getEmails() {
  const queryStr = "SELECT email, role FROM mail_list";
  try {
    const emails = await db.many(queryStr);

    return emails;
  } catch (err) {
    return err;
  }
}

async function addEmail(data) {
  const queryStr =
    "INSERT INTO mail_list (email, role) " +
    "VALUES ($[email], $[role]) RETURNING *";
  try {
    const email = await db.one(queryStr, data);
    return email;
  } catch (err) {
    return err;
  }
}

async function deleteEmail(id) {
  const queryStr = "DELETE FROM mail_list WHERE id=$[id] RETURNING *";
  try {
    const email = await db.one(queryStr, { id });
    return email;
  } catch (err) {
    return err;
  }
}

module.exports = { getEmails, addEmail, deleteEmail };
