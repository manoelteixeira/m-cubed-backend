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
    industry: "borrowers.industry",
    state: "borrowers.state",
    credit_score: "borrowers.credit_score",
  };
  const totalRequestsQuery =
    "SELECT COUNT(*) FROM loan_requests " +
    "WHERE funded_at is NULL AND accepted_proposal_id is null";

  const baseQuery =
    "SELECT loan_requests.id, loan_requests.title, loan_requests.description, " +
    "loan_requests.value, loan_requests.created_at, loan_requests.borrower_id, borrowers.state, " +
    "borrowers.credit_score, borrowers.industry " +
    "FROM loan_requests JOIN borrowers " +
    "ON loan_requests.borrower_id = borrowers.id " +
    "WHERE funded_at is NULL AND accepted_proposal_id is NULL ";
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
      total: Number(total.count),
      loan_requests: requests,
    };
  } catch (err) {
    console.error(err);
    return err;
  }
}

// Get a single loan request by loan_request_id
async function getLoanRequestByID(loan_request_id) {
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
}

async function createProposal(proposal) {
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
}

module.exports = {
  getAllLoanRequests,
  getLoanRequestByID,
  createProposal,
};
