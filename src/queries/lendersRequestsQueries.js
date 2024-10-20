const db = require("../db/dbConfig");

// Get all pending loan requests
async function getAllLoanRequests(
  sortBy = "created_at",
  order = "desc",
  limit = null,
  ofsset = null,
  search = null
) {
  console.log(search);
  const sort = {
    title: "loan_requests.title",
    value: "loan_requests.value",
    created_at: "loan_requests.created_at",
    description: "loan_requests.description",
    industry: "borrowers.industry",
    state: "borrowers.state",
    credit_score: "borrowers.credit_score",
  };
  const totalRequestsQuery =
    "SELECT COUNT(*), SUM( loan_requests.value) FROM loan_requests  " +
    "WHERE status='pending' ";

  const baseQuery =
    "SELECT * FROM loan_requests JOIN ( " +
    "SELECT borrowers.id borrower_id, borrowers.state, borrowers.industry, credit_reports.score credit_score " +
    "FROM borrowers JOIN credit_reports  " +
    "ON borrowers.id = credit_reports.borrower_id ) borrowers " +
    "ON loan_requests.borrower_id = borrowers.borrower_id " +
    "WHERE status='pending' ";

  let query = baseQuery;

  if (search) {
    query += `AND loan_requests.title ilike $[search]`;
  }
  if (sortBy) {
    query += `ORDER BY ${sort[sortBy]} ${order.toUpperCase()} `;
  }

  if (limit) {
    query += `LIMIT ${limit} `;
  }
  if (ofsset) {
    query += `OFFSET ${ofsset} `;
  }

  try {
    const total = await db.one(totalRequestsQuery);
    const requests = await db.manyOrNone(query, { search: `%${search}%` });

    return {
      total: parseInt(total.count),
      value: parseFloat(total.sum),
      loan_requests: requests,
    };
  } catch (err) {
    console.error(err);
    return err;
  }
}

// Get a single loan request by loan_request_id
async function getLoanRequestByID(loan_request_id) {
  const query = `SELECT * FROM loan_requests WHERE id = $[id]`;
  const borrowerQuery =
    "SELECT borrowers.id , borrowers.city, borrowers.street, borrowers.state, borrowers.zip_code, " +
    "borrowers.phONe, borrowers.business_name, borrowers.ein, borrowers.start_date, borrowers.industry, " +
    "users.email, borrowers.credit_score " +
    "FROM users JOIN ( " +
    "SELECT borrowers.id , borrowers.city, borrowers.street, borrowers.state, borrowers.zip_code, borrowers.user_id, " +
    "borrowers.phONe, borrowers.business_name, borrowers.ein, borrowers.start_date, borrowers.industry, credit_reports.score credit_score " +
    "FROM borrowers JOIN credit_reports " +
    "ON borrowers.id  = credit_reports.borrower_id) borrowers " +
    "ON borrowers.user_id = users.id " +
    "WHERE borrowers.id=$1";
  try {
    const loanRequest = await db.one(query, { id: loan_request_id });
    const borrower = await db.one(borrowerQuery, [loanRequest.borrower_id]);
    delete loanRequest.borrower_id;
    delete borrower.user_id;
    loanRequest.borrower = borrower;
    console.log(loanRequest, borrower);
    return loanRequest;
  } catch (error) {
    console.log(error);
    if (error.received == 0) {
      return { error: "Loan request Not found." };
    }
    return error;
  }
}

async function createProposal(proposal) {
  try {
    const query = `
      INSERT INTO loan_proposals (lender_id, loan_request_id, title, description, loan_amount, interest_rate, repayment_term, created_at, expire_at)
      VALUES ($[lender_id], $[loan_request_id], $[title], $[description], $[loan_amount], $[interest_rate], $[repayment_term], $[created_at], $[expire_at])
      RETURNING *`;
    const newProposal = await db.one(query, proposal);
    return newProposal;
  } catch (error) {
    return error;
  }
}

module.exports = {
  getAllLoanRequests,
  getLoanRequestByID,
  createProposal,
};
