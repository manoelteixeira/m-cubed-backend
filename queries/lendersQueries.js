const db = require("../db/dbConfig.js");
const bcrypt = require("bcrypt");

/**
 * Get all lenders
 * @returns {Array} - List of All lenders
 */
const getAllLenders = async () => {
  const queryStr = "SELECT * FROM lenders";
  try {
    const allLenders = await db.any(queryStr);
    return allLenders;
  } catch (error) {
    return error;
  }
};

// Get a specific lender by ID
const getLender = async (id) => {
  const queryStr = "SELECT * FROM lenders WHERE id=$[id]";
  try {
    const oneLender = await db.one(queryStr, { id });
    return oneLender;
  } catch (error) {
    return error;
  }
};

// Create a new lender
const createLender = async (lender) => {
  const salt = 10;
  const queryStr =
    "INSERT INTO lenders (email, password, business_name) " +
    "VALUES ($[email], $[password_hash], $[business_name]) " +
    "RETURNING *";

  try {
    const { email, password, business_name } = lender;
    const password_hash = await bcrypt.hash(password, salt);
    const newLender = await db.one(queryStr, {
      email,
      password_hash,
      business_name,
    });

    return newLender;
  } catch (error) {
    return error;
  }
};

// Delete a lender by ID
const deleteLender = async (id) => {
  const queryStr = "DELETE FROM lenders WHERE id = $[id] RETURNING *";
  try {
    const deletedLender = await db.one(queryStr, { id });
    return deletedLender;
  } catch (error) {
    return error;
  }
};

// Update a lender by ID
const updateLender = async (id, lender) => {
  const queryStr =
    "UPDATE lenders " +
    "SET email = $[email], business_name = $[business_name] " +
    "WHERE id = $[id] RETURNING * ";

  try {
    const updatedLender = await db.one(queryStr, { ...lender, id });

    return updatedLender;
  } catch (error) {
    return error;
  }
};

module.exports = {
  getAllLenders,
  getLender,
  createLender,
  deleteLender,
  updateLender,
};
