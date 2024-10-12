const db = require("./dbConfig.js");
const {
  createLender,
  createBorrower,
  createLoanRequest,
  createLoanProposal,
  userFactory,
  loanRequestFactory,
  loanProposalFactory,
} = require("./seedUtils.js");

async function addUsers(users) {
  let usersString = users
    .map((user) => {
      const { email, password, role } = user;
      return `('${email}', '${password}', '${role}')`;
    })
    .join(", ");
  const queryStr = `INSERT INTO users(email, password, role) VALUES ${usersString} RETURNING *`;
  try {
    const result = await db.many(queryStr);
    return result;
  } catch (err) {
    console.log("ERROR: ", err);
  }
}

async function addLenders(lenders) {
  const lendersStr = lenders
    .map((lender) => {
      const { name, user_id } = lender;
      return `('${name.replaceAll("'", "\\'")}', '${user_id}')`;
    })
    .join(", ");
  const queryStr = `INSERT INTO lenders(business_name, user_id) VALUES ${lendersStr} RETURNING *`;
  try {
    const result = await db.many(queryStr);
    return result;
  } catch (err) {
    console.log("ERROR: ", err);
  }
}

async function addBorrowers(borrowers) {
  const borrowersStr = borrowers
    .map((borrower) => {
      const {
        city,
        street,
        state,
        zip_code,
        phone,
        name,
        credit_score,
        start_date,
        industry,
        user_id,
      } = borrower;
      return `('${city}', '${street}', '${state}', '${zip_code}', '${phone}', '${name.replaceAll(
        "'",
        "\\'"
      )}', ${credit_score}, '${start_date}', '${industry}', '${user_id}')`;
    })
    .join(", ");
  const queryStr = `INSERT INTO borrowers( city, street, state, zip_code, phone, business_name, credit_score, start_date, industry, user_id) VALUES ${borrowersStr} RETURNING *`;
  try {
    const result = await db.many(queryStr);
    return result;
  } catch (err) {
    console.log("ERROR: ", err);
  }
}

async function addLoanRequests(requests) {
  const requestsStr = requests
    .map((request) => {
      const { title, description, value, created_at, borrower_id } = request;
      return `('${title.replaceAll(
        "'",
        "\\'"
      )}','${description}',${value},'${created_at}','${borrower_id}')`;
    })
    .join(", ");
  const queryStr = `INSERT INTO loan_requests(title, description, value, created_at, borrower_id) VALUES ${requestsStr} RETURNING *`;
  try {
    const result = await db.many(queryStr);
    return result;
  } catch (err) {
    console.log("ERROR: ", err);
  }
}

async function addLoanProposals(proposals) {
  const proposalsStr = proposals
    .map((proposal) => {
      const {
        title,
        description,
        loan_amount,
        interest_rate,
        repayment_term,
        lender_id,
        created_at,
        loan_request_id,
      } = proposal;
      return `('${title}', '${description}', '${loan_amount}', ${interest_rate}, ${repayment_term}, '${lender_id}', '${created_at}', '${loan_request_id}')`;
    })
    .join(", ");
  const queryStr = `INSERT INTO loan_proposals(title, description, loan_amount, interest_rate, repayment_term, lender_id, created_at, loan_request_id) VALUES ${proposalsStr} RETURNING *`;
  try {
    const result = await db.many(queryStr);
    return result;
  } catch (err) {
    console.log("ERROR: ", err);
  }
}

async function seed(nLenders, nBorrowers, nRequests, nProposals) {
  // Create And Add Users
  let users = [
    ...(await userFactory(nLenders, createLender)),
    ...(await userFactory(nBorrowers, createBorrower)),
  ];

  console.log("** Creating USERS **");
  const newUsers = await addUsers(users);
  //   Add Users to their roles
  let lenders = newUsers.filter((user) => user.role === "lender");
  let borrowers = newUsers.filter((user) => user.role === "borrower");

  lenders = lenders.map((lender) => {
    user = users.find((user) => user.email == lender.email);
    return { ...user, user_id: lender.id };
  });

  borrowers = borrowers.map((borrower) => {
    user = users.find((user) => user.email == borrower.email);
    return { ...user, user_id: borrower.id };
  });

  console.log("** Adding USERS to their ROLES **");
  lenders = await addLenders(lenders);
  borrowers = await addBorrowers(borrowers);

  console.log("** Adding Loan Requests **");

  let loanRequests = borrowers.map((borrower) => {
    const { id } = borrower;
    const requests = [];
    for (let i = 0; i <= nRequests; i++) {
      requests.push(createLoanRequest(id));
    }
    return requests;
  });

  const requests = await addLoanRequests(loanRequests.flat());

  console.log("** Adding Loan Proposals **");

  // const lendersId = lenders.map((lender) => lender.id);
  const loanProposals = [];
  // console.log(requests)
  requests.forEach((request) => {
    for (const lender of lenders) {
      loanProposals.push(createLoanProposal(request, lender));
    }
  });
  const proposals = await addLoanProposals(loanProposals);
  console.log("** ALL DONE **");
}

seed(5, 10, 5);
