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

// Get a single loan request by loan_request_id
const getLoanRequestByID = async (loan_request_id) => {
  const query = `SELECT * FROM loan_requests WHERE id = $1`;
  const borrowerQuery =
    "SELECT id, email, city, street, state, zip_code, phone, business_name, credit_score, start_date, industry " +
    "FROM borrowers WHERE id=$1";
  try {
    const loanRequest = await db.oneOrNone(query, [loan_request_id]);
    const borrower = await db.one(borrowerQuery, [loanRequest.borrower_id]);
    console.error(borrower);
    delete loanRequest.borrower_id;
    loanRequest.borrower = borrower;
    return loanRequest;
  } catch (error) {
    console.error("Error fetching loan request by ID:", error);
    throw error;
  }
};

const createProposal = async (proposal) => {
  try {
    const query = `
      INSERT INTO loan_proposals (lender_id, loan_request_id, title, description, loan_amount, interest_rate, repayment_term, created_at)
      VALUES ($[lender_id], $[loan_request_id], $[title], $[description], $[loan_amount], $[interest_rate], $[repayment_term], $[created_at])
      RETURNING *`;
    const newProposal = await db.one(query, proposal);
    return newProposal;
  } catch (error) {
    return error;
  }
};

const createProposal = async (proposal) => {
  try {
    const { title, description, value, borrower_id } = requestData;
    const query = `
      INSERT INTO loan_requests (title, description, value, created_at, borrower_id)
      VALUES ($1, $2, $3, NOW(), $4)
      RETURNING *`;
    const newProposal = await db.one(query, proposal);
    return newProposal;
  } catch (error) {
    return error;
  }
};

module.exports = {
  getAllLoanRequests,
  getLoanRequestByID,
  createProposal,
};
