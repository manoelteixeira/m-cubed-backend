const db = require("../db/dbConfig");

// Get all pending loan requests
async function getAllLoanRequests(
  id,
  sortBy = "created_at",
  order = "desc",
  limit = null,
  ofsset = null,
  search = null,
  hide = true
) {
  console.log(search);
  const sort = {
    title: "title",
    value: "value",
    created_at: "created_at",
    description: "description",
    industry: "industry",
    state: "rstate",
    credit_score: "credit_score",
  };
  const totalRequestsQuery =
    "SELECT COUNT(*), SUM( loan_requests.value) FROM loan_requests  " +
    "WHERE status='pending' ";

  const baseQuery =
    "select lri.id, lri.title, lri.description, lri.value ,lri.created_at ,lri.expire_at ,lri.status, lri.id  as borrower_id, " +
    "lri.credit_score, lri.city , lri.state , lri.business_name , lri.industry, llr.favorite, llr.hide " +
    "from loan_requests_info as lri full join (select lender_loan_requests.lender_id, lender_loan_requests.loan_request_id, " +
    "lender_loan_requests.favorite,lender_loan_requests.hide " +
    "from lender_loan_requests join lenders on lender_loan_requests.lender_id = lenders.id " +
    "where lenders.id = $[id]) as llr on lri.id = llr.loan_request_id " +
    `where ${
      hide == true ? "llr.hide != true or llr.hide is null and " : ""
    }lri.id not in (select loan_request_id from loan_proposals  ` +
    "where loan_proposals.lender_id = $[id]) ";

  let query = baseQuery;

  if (search) {
    query += `AND requests.title ilike $[search]`;
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
    const requests = await db.manyOrNone(query, { search: `%${search}%`, id });

    return {
      total: parseInt(total.count),
      value: parseFloat(total.sum),
      requests_count: requests.length,
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
    "borrowers.phone, borrowers.business_name, borrowers.ein, borrowers.start_date, borrowers.industry, " +
    "users.email, borrowers.credit_score " +
    "FROM users JOIN ( " +
    "SELECT borrowers.id , borrowers.city, borrowers.street, borrowers.state, borrowers.zip_code, borrowers.user_id, " +
    "borrowers.phone, borrowers.business_name, borrowers.ein, borrowers.start_date, borrowers.industry, credit_reports.score credit_score " +
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
      INSERT INTO loan_proposals (lender_id, loan_request_id, title, description, requirements, loan_amount, interest_rate, repayment_term, created_at, expire_at)
      VALUES ($[lender_id], $[loan_request_id], $[title], $[description], $[requirements], $[loan_amount], $[interest_rate], $[repayment_term], $[created_at], $[expire_at])
      RETURNING *`;
    const newProposal = await db.one(query, proposal);
    return newProposal;
  } catch (error) {
    return error;
  }
}

async function setRequestHide(lender_id, id, hide) {
  console.log(hide);
  const getHideQuery =
    "SELECT * FROM lender_loan_requests " +
    "WHERE lender_id = $[lender_id] and loan_request_id = $[id]";
  const createHide =
    "INSERT INTO lender_loan_requests (lender_id, loan_request_id, hide) " +
    "VALUES ($[lender_id], $[id], $[hide]) RETURNING *";
  const updateHide =
    "UPDATE lender_loan_requests SET hide=$[hide] " +
    "WHERE lender_id = $[lender_id] and loan_request_id = $[id] RETURNING *";
  try {
    let data = await db.oneOrNone(getHideQuery, { lender_id, id });
    console.log(data);
    if (data) {
      data = await db.one(updateHide, { lender_id, id, hide });
    } else {
      data = await db.one(createHide, { lender_id, id, hide });
    }
    return data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

async function setRequestFavorite(lender_id, id, favorite) {
  const getHideQuery =
    "SELECT * FROM lender_loan_requests " +
    "WHERE lender_id = $[lender_id] and loan_request_id = $[id]";
  const createHide =
    "INSERT INTO lender_loan_requests (lender_id, loan_request_id, favorite) " +
    "VALUES ($[lender_id], $[id], $[favorite]) RETURNING *";
  const updateHide =
    "UPDATE lender_loan_requests SET favorite=$[favorite] " +
    "WHERE lender_id = $[lender_id] and loan_request_id = $[id] RETURNING *";
  try {
    let data = await db.oneOrNone(getHideQuery, { lender_id, id });
    console.log(data);
    if (data) {
      console.log("update");
      data = await db.one(updateHide, { lender_id, id, favorite });
    } else {
      console.log("create");
      data = await db.one(createHide, { lender_id, id, favorite });
    }
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

module.exports = {
  getAllLoanRequests,
  getLoanRequestByID,
  createProposal,
  setRequestHide,
  setRequestFavorite,
};
