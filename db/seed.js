const {
  createLender,
  createBorrower,
  createLoanRequest,
  createLoanProposal,
} = require("./seedUtils.js");
const salt = 10;
const db = require("./dbConfig.js");

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
      return `('${name}', '${user_id}')`;
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
      return `('${city}', '${street}', '${state}', '${zip_code}', '${phone}', '${name}', ${credit_score}, '${start_date}', '${industry}', '${user_id}')`;
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
      return `('${title}','${description}',${value},'${created_at}','${borrower_id}')`;
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

async function seed(nLenders, nBorrowers, nRequests, nProposals) {
  // Create And Add Users
  let users = [];
  for (let i = 0; i <= nLenders + nBorrowers; i++) {
    if (i < nLenders) {
      users.push(await createLender());
    } else {
      users.push(await createBorrower());
    }
  }
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
  const lendersId = lenders.map((lender) => lender.id);
  const loanProposals = requests.map((request) => {
    const proposals = [];
    for (const id of lendersId) {
      for (let i = 0; i < nProposals; i++) {
        const proposal = createLoanProposal(request, id);
        console.log(proposal);
        proposals.push(proposal);
      }
    }
    return proposals;
  });
  console.log(loanProposals);
}

seed(5, 10, 5);