// src/utils/queryFactoies.js

function addUsersQuery(users) {
  let usersString = users
    .map((user) => {
      const { email, password, role, last_logged } = user;
      return `('${email}', '${password}', '${role}', '${last_logged}')`;
    })
    .join(", ");
  const query =
    "INSERT INTO users(email, password, role, last_logged) " +
    `VALUES ${usersString} RETURNING *`;
  return query;
}

function addLendersQuery(lenders) {
  const lendersStr = lenders
    .map((lender) => {
      const { business_name, image_url, user_id } = lender;
      return `('${business_name}', '${image_url}', '${user_id}')`;
    })
    .join(", ");
  const query =
    "INSERT INTO lenders(business_name, image_url, user_id) " +
    `VALUES ${lendersStr} RETURNING *`;
  return query;
}

function addBorrowersQuery(borrowers) {
  const borrowersStr = borrowers
    .map((borrower) => {
      const {
        city,
        street,
        state,
        zip_code,
        phone,
        business_name,
        image_url,
        ein,
        start_date,
        industry,
        user_id,
      } = borrower;
      return (
        `('${city}', '${street}', '${state}', '${zip_code}', '${phone}', ` +
        `'${business_name}', '${image_url}', ${ein}, '${start_date}', '${industry}', '${user_id}')`
      );
    })
    .join(", ");
  const query =
    "INSERT INTO borrowers( city, street, state, zip_code, phone, business_name, image_url, ein, start_date, industry, user_id) " +
    `VALUES ${borrowersStr} RETURNING *`;
  return query;
}

function addCreditReportsQuery(reports) {
  const reportStr = reports
    .map((report) => {
      const {
        credit_bureau,
        report_id,
        score,
        created_at,
        expire_at,
        borrower_id,
      } = report;
      return `('${credit_bureau}', '${report_id}', ${score}, '${created_at}', '${expire_at}', '${borrower_id}')`;
    })
    .join(", ");
  const query =
    "INSERT INTO credit_reports ( credit_bureau, report_id, score, created_at, expire_at, borrower_id) " +
    `VALUES ${reportStr} RETURNING *`;
  return query;
}

function addLoanRequestsQuery(requests) {
  const requestsStr = requests
    .map((request) => {
      const { title, description, value, created_at, expire_at, borrower_id } =
        request;
      return `('${title}','${description}',${value},'${created_at}','${expire_at}','${borrower_id}')`;
    })
    .join(", ");
  const query =
    "INSERT INTO loan_requests (title, description, value, created_at, expire_at, borrower_id) " +
    `VALUES ${requestsStr} RETURNING *`;
  return query;
}

function addLoanProposalsQuery(proposals) {
  const proposalsStr = proposals
    .map((proposal) => {
      const {
        title,
        description,
        requirements,
        loan_amount,
        interest_rate,
        repayment_term,
        lender_id,
        created_at,
        expire_at,
        loan_request_id,
      } = proposal;

      let req = Array.isArray(requirements)
        ? `ARRAY[${requirements.map((item) => `'${item}'`)}]`
        : `ARRAY['None']`;

      return `('${title}', '${description}', ${req},'${loan_amount}', ${interest_rate}, ${repayment_term}, '${lender_id}', '${created_at}', '${expire_at}', '${loan_request_id}')`;
    })
    .join(", ");

  const query =
    "INSERT INTO loan_proposals (title, description, requirements, loan_amount, interest_rate, repayment_term, lender_id, created_at, expire_at, loan_request_id) " +
    `VALUES ${proposalsStr} RETURNING *`;

  return query;
}

function addToMailListQuery(users) {
  const mailListStr = users
    .map((user) => {
      const { role, email } = user;
      return `('${role}', '${email}')`;
    })
    .join();
  const query =
    "INSERT INTO mail_list (role, email) " +
    `VALUES ${mailListStr} RETURNING *`;
  return query;
}

module.exports = {
  addUsersQuery,
  addLendersQuery,
  addBorrowersQuery,
  addCreditReportsQuery,
  addLoanRequestsQuery,
  addLoanProposalsQuery,
  addToMailListQuery,
};
