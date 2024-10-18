// repos/m-cubed-backend/src/db/seed.js
const db = require("./dbConfig.js");
const {
  lenderFactory,
  borrowerFactory,
  createUser,
  loanRequestFactory,
  createLoanProposal,
  createCreditReport,
} = require("../utils/dataFactories.js");
const {
  addUsersQuery,
  addLendersQuery,
  addBorrowersQuery,
  addCreditReportsQuery,
  addLoanRequestsQuery,
  addLoanProposalsQuery,
  addToMailListQuery,
} = require("../utils/queryFactoies.js");

async function seed(nLenders, nBorrowers, nLoanRequest) {
  let users = [];

  let lenders = lenderFactory(nLenders);
  for (let idx = 0; idx < lenders.length; idx++) {
    const user = await createUser(lenders[idx], "lender");
    users.push(user);
    lenders[idx] = { ...lenders[idx], ...user };
  }

  let borrowers = borrowerFactory(nBorrowers);
  for (let idx = 0; idx < borrowers.length; idx++) {
    const user = await createUser(borrowers[idx], "borrower");
    users.push(user);
    borrowers[idx] = { ...borrowers[idx], ...user };
  }

  console.log("-=-=-    ADDING USERS    -=-=-");
  users = await db.many(addUsersQuery(users));
  console.log(users);

  console.log("-=-=-    ADDING LENDERS    -=-=-");
  lenders = lenders.map((lender) => {
    const user = users.find((user) => user.email == lender.email);
    return { ...lender, user_id: user.id };
  });

  let data = await db.many(addLendersQuery(lenders));
  lenders = lenders.map((lender) => {
    const info = data.find((item) => item.user_id == lender.user_id);
    delete info.user_id;
    delete lender.role;
    return {
      ...info,
      ...lender,
    };
  });
  console.log(lenders);

  console.log("-=-=-    ADDING BORROWERS    -=-=-");
  borrowers = borrowers.map((borrower) => {
    const user = users.find((user) => user.email == borrower.email);
    return { ...borrower, user_id: user.id };
  });

  data = await db.many(addBorrowersQuery(borrowers));
  borrowers = borrowers.map((borrower) => {
    const info = data.find((item) => item.user_id == borrower.user_id);
    delete info.user_id;
    delete borrower.role;
    return {
      ...info,
      ...borrower,
    };
  });
  console.log(borrowers);

  console.log("-=-=-    ADDING CREDIT REPORTS    -=-=-");
  let reports = borrowers.map((borrower) => {
    const { id } = borrower;
    return createCreditReport(id);
  });
  reports = await db.many(addCreditReportsQuery(reports));
  console.log(reports);

  console.log("-=-=-    ADDING LOAN REQUEST    -=-=-");
  let loanRequests = borrowers
    .map((borrower) => {
      const { id } = borrower;
      return loanRequestFactory(nLoanRequest, id);
    })
    .flat();

  loanRequests = await db.many(addLoanRequestsQuery(loanRequests));
  console.log(loanRequests);

  console.log("-=-=-    ADDING LOAN PROPOSALS    -=-=-");
  let loanProposals = loanRequests
    .map((request) => {
      const proposal = lenders.map((lender) =>
        createLoanProposal(request, lender)
      );
      return proposal;
    })
    .flat();

  loanProposals = await db.many(addLoanProposalsQuery(loanProposals));
  console.log(loanProposals);

  console.log("-=-=-    ADDING DATA TO MAIL LIST    -=-=-");
  const mailList = await db.many(addToMailListQuery(users));
  console.log(mailList);

  console.log("-=-=-    ALL DONE    -=-=-");
}

// console.log(seed(2, 2, 2));
seed(10, 100, 10);
