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
    "SELECT borrowers.id, users.id as user_id, users.email, borrowers.city, borrowers.street, borrowers.state, " +
    "borrowers.zip_code, borrowers.phone, borrowers.business_name, borrowers.credit_score, borrowers.start_date, borrowers.industry " +
    "FROM users JOIN borrowers ON users.id = borrowers.user_id " +
    "WHERE borrowers.id=$1";
  try {
    const loanRequest = await db.one(query, [loan_request_id]);
    const borrower = await db.one(borrowerQuery, [loanRequest.borrower_id]);
    delete loanRequest.borrower_id;
    delete borrower.user_id;
    loanRequest.borrower = borrower;
    return loanRequest;
  } catch (error) {
    if (error.received == 0) {
      return { error: "Loan request Not found." };
    }
    return error;
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

module.exports = {
  getAllLoanRequests,
  getLoanRequestByID,
  createProposal,
};
