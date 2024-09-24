const db = require("../db/dbConfig");

// Get all loan requests (no filter)
//URL: GET /api/lenders/requests/all
//localhost:4001/lenders/requests/all
const getAllLoanRequests = async () => {
  try {
    const query = "SELECT * FROM loan_requests";
    const loanRequests = await db.any(query);
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

module.exports = {
  getAllLoanRequests,
  getAllLoanRequestsByLenderID,
  getLoanRequestByID,
  createLoanRequest,
};
