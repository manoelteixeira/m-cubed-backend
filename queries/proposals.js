const db = require("../db/dbConfig");

// Get all loan proposals made by a specific lender
const getAllLoanProposalsByLenderID = async (lender_id) => {
  try {
    const query = `SELECT * FROM loan_proposals WHERE lender_id = $1`;
    const allProposals = await db.any(query, [lender_id]);
    return allProposals;
  } catch (error) {
    console.error("Error fetching all loan proposals for lender:", error);
    throw error;
  }
};

// Get a single loan proposal by lender ID and proposal ID
const getProposalByID = async (lender_id, proposal_id) => {
  try {
    const query = `SELECT * FROM loan_proposals WHERE lender_id = $1 AND id = $2`;
    const proposal = await db.oneOrNone(query, [lender_id, proposal_id]);
    return proposal;
  } catch (error) {
    console.error(
      `Error fetching loan proposal with ID ${proposal_id}:`,
      error
    );
    throw error;
  }
};

// Get all loan proposals by loan request ID (since no borrower_id in schema)
const getProposalsByRequestID = async (request_id) => {
  try {
    const query = `SELECT * FROM loan_proposals WHERE loan_request_id = $1`;
    const proposals = await db.any(query, [request_id]);
    return proposals;
  } catch (error) {
    console.error("Error fetching loan proposals for request:", error);
    throw error;
  }
};

// Create a new loan proposal based on a loan request
const createProposalFromRequest = async (
  lender_id,
  request_id,
  proposalData
) => {
  try {
    const { title, description, accepted } = proposalData;
    const query = `
      INSERT INTO loan_proposals (lender_id, loan_request_id, title, description, created_at, accepted)
      VALUES ($1, $2, $3, $4, NOW(), $5)
      RETURNING *`;
    const newProposal = await db.one(query, [
      lender_id,
      request_id,
      title,
      description,
      accepted,
    ]);
    return newProposal;
  } catch (error) {
    console.error("Error creating loan proposal:", error);
    throw error;
  }
};

// Update a loan proposal by ID
const updateProposalByID = async (lender_id, proposal_id, proposalData) => {
  try {
    const { title, description, accepted } = proposalData;
    const query = `
      UPDATE loan_proposals 
      SET title = $1, description = $2, accepted = $3 
      WHERE lender_id = $4 AND id = $5 
      RETURNING *`;
    const updatedProposal = await db.oneOrNone(query, [
      title,
      description,
      accepted,
      lender_id,
      proposal_id,
    ]);
    return updatedProposal;
  } catch (error) {
    console.error(
      `Error updating loan proposal with ID ${proposal_id}:`,
      error
    );
    throw error;
  }
};

// Delete a loan proposal by ID
const deleteProposalByID = async (lender_id, proposal_id) => {
  try {
    const query = `DELETE FROM loan_proposals WHERE lender_id = $1 AND id = $2 RETURNING *`;
    const deletedProposal = await db.oneOrNone(query, [lender_id, proposal_id]);
    return deletedProposal;
  } catch (error) {
    console.error(
      `Error deleting loan proposal with ID ${proposal_id}:`,
      error
    );
    throw error;
  }
};

module.exports = {
  getAllLoanProposalsByLenderID,
  getProposalByID,
  getProposalsByRequestID,
  createProposalFromRequest,
  updateProposalByID,
  deleteProposalByID,
};
