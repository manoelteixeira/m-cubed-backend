const db = require("../db/dbConfig");

// Get all pending loan requests (no filter)
const getAllLoanRequests = async () => {
  try {
    const queryStr =
      "SELECT * FROM loan_requests " +
      "WHERE funded_at is NULL AND accepted_proposal_id is NULL";
    const loanRequests = await db.any(queryStr);

    return loanRequests;
  } catch (error) {
    console.error("Error fetching all loan requests:", error);
    throw error;
  }
};

// Get all loan requests for a specific lender using only loan_proposals
//URL: GET /api/lenders/requests/lender/:lender_id
//localhost:4001/lenders/requests/lender/:lender_id
const getAllLoanRequestsByLenderID = async (lender_id) => {
  try {
    const query = `
      SELECT * 
      FROM loan_requests 
      WHERE id IN (
        SELECT loan_request_id 
        FROM loan_proposals 
        WHERE lender_id = $1
      )
    `;
    const loanRequests = await db.any(query, [lender_id]);
    return loanRequests;
  } catch (error) {
    console.error("Error fetching loan requests for lender:", error);
    throw error;
  }
};

// Get a single loan request by loan_request_id
//URL: GET /api/lenders/requests/:loan_request_id
//localhost:4001/lenders/requests/:loan_request_id
const getLoanRequestByID = async (loan_request_id) => {
  try {
    const query = `SELECT * FROM loan_requests WHERE id = $1`;
    const loanRequest = await db.oneOrNone(query, [loan_request_id]);
    return loanRequest;
  } catch (error) {
    console.error("Error fetching loan request by ID:", error);
    throw error;
  }
};

// Create a new loan request
//
const createLoanRequest = async (requestData) => {
  try {
    const { title, description, value, borrower_id } = requestData;
    const query = `
      INSERT INTO loan_requests (title, description, value, created_at, borrower_id)
      VALUES ($1, $2, $3, NOW(), $4)
      RETURNING *`;
    const newLoanRequest = await db.one(query, [
      title,
      description,
      value,
      borrower_id,
    ]);
    return newLoanRequest;
  } catch (error) {
    console.error("Error creating new loan request:", error);
    throw error;
  }
};

const createProposal = async (proposal) => {
  try {
    // const { title, description, accepted } = proposalData;
    const query = `
      INSERT INTO loan_proposals (lender_id, loan_request_id, title, description, created_at)
      VALUES ($[lender_id], $[loan_request_id], $[title], $[description], $[created_at])
      RETURNING *`;
    const newProposal = await db.one(query, proposal);
    return newProposal;
  } catch (error) {
    return error;
  }
};

module.exports = {
  getAllLoanRequests,
  getAllLoanRequestsByLenderID,
  getLoanRequestByID,
  createLoanRequest,
  createProposal,
};
