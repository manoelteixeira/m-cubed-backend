const db = require("../db/dbConfig.js");

// Get all lenders
const getAllLenders = async () => {
  try {
    const allLenders = await db.any("SELECT * FROM lenders");
    return allLenders;
  } catch (error) {
    console.error("Error getting all lenders:", error);
    throw new Error("Error retrieving lenders");
  }
};

// Get a specific lender by ID
const getLender = async (id) => {
  try {
    const oneLender = await db.one("SELECT * FROM lenders WHERE id=$1", id);
    return oneLender;
  } catch (error) {
    console.error(`Error getting lender with ID ${id}:`, error);
    throw new Error(`Error retrieving lender with ID ${id}`);
  }
};

// Create a new lender
const createLender = async (lender) => {
  try {
    const { email, password, business_name } = lender;

    const newLender = await db.one(
      "INSERT INTO lenders (email, password, business_name) VALUES ($1, $2, $3) RETURNING *",
      [email, password, business_name]
    );

    return newLender;
  } catch (error) {
    console.error("Error creating new lender:", error);
    throw new Error("Error creating lender");
  }
};

// Delete a lender by ID
const deleteLender = async (id) => {
  try {
    const deletedLender = await db.one(
      "DELETE FROM lenders WHERE id = $1 RETURNING *",
      id
    );
    return deletedLender;
  } catch (error) {
    console.error(`Error deleting lender with ID ${id}:`, error);
    throw new Error(`Error deleting lender with ID ${id}`);
  }
};

// Update a lender by ID
const updateLender = async (id, lender) => {
  try {
    const { email, password, business_name } = lender;

    const query = `
      UPDATE lenders
      SET email = $1,
          password = $2,
          business_name = $3
      WHERE id = $4
      RETURNING *;
    `;

    const updatedLender = await db.one(query, [
      email,
      password,
      business_name,
      id,
    ]);

    return updatedLender;
  } catch (error) {
    console.error(`Error updating lender with ID ${id}:`, error);
    throw new Error(`Error updating lender with ID ${id}`);
  }
};

// Get lender by proposal ID
const getLenderByProposalID = async (proposal_id) => {
  try {
    // Step 1: Get lender_id from loan_proposals using proposal_id
    const { lender_id } = await db.one(
      "SELECT lender_id FROM loan_proposals WHERE id = $1",
      proposal_id
    );

    // Step 2: Use lender_id to get the lender from lenders table
    const lender = await db.one(
      "SELECT * FROM lenders WHERE id = $1",
      lender_id
    );
    return lender;
  } catch (error) {
    console.error(`Error getting lender by proposal ID ${proposal_id}:`, error);
    throw new Error(
      `Error retrieving lender for proposal with ID ${proposal_id}`
    );
  }
};

module.exports = {
  getAllLenders,
  getLender,
  createLender,
  deleteLender,
  updateLender,
  getLenderByProposalID,
};
