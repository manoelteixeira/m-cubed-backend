// repos/m-cubed-backend/src/db/seed.js
const colors = require("colors");
const db = require("./dbConfig.js");
const { offsetDate, randomInt, choose } = require("../utils/helpers.js");
const {
  lenderFactory,
  borrowerFactory,
  createUser,
  userFactory,
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
  addLenderLoanProposalQuery,
} = require("../utils/queryFactoies.js");

async function seed(nLenders, nBorrowers, nLoanRequest) {
  let lenders = await lenderFactory(nLenders);
  let borrowers = await borrowerFactory(nBorrowers);
  let users = await userFactory({ lender: lenders, borrower: borrowers });

  console.log("-=-=-    ADDING USERS    -=-=-");
  users = await db.many(addUsersQuery(users));
  // console.log(users.map((item, idx) => `${idx + 1} - ${item.id}`));
  console.log(`${colors.yellow(users.length)} Users Added.`);

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
  // console.log(lenders.map((item, idx) => `${idx + 1} - ${item.id}`));
  console.log(`${colors.yellow(lenders.length)} Lenders Added.`);

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
  // console.log(borrowers.map((item, idx) => `${idx + 1} - ${item.id}`));
  console.log(`${colors.yellow(borrowers.length)} Borrowers Added.`);

  console.log("-=-=-    ADDING CREDIT REPORTS    -=-=-");
  let reports = borrowers.map((borrower) => {
    const { id } = borrower;
    // const date = faker.date.past({ days: 10 });
    const date = offsetDate(new Date(), { days: randomInt(1, 15) * -1 });
    return createCreditReport(id, date);
  });

  reports = await db.many(addCreditReportsQuery(reports));
  // console.log(reports.map((item, idx) => `${idx + 1} - ${item.id}`));
  console.log(`${colors.yellow(reports.length)} Reports Added.`);

  console.log("-=-=-    ADDING LOAN REQUEST    -=-=-");
  let loanRequests = borrowers
    .map((borrower) => {
      const { id } = borrower;
      return loanRequestFactory(nLoanRequest, id);
    })
    .flat();

  loanRequests = await db.many(addLoanRequestsQuery(loanRequests));
  // console.log(loanRequests.map((item, idx) => `${idx + 1} - ${item.id}`));
  console.log(`${colors.yellow(loanRequests.length)} Loan Requests Added.`);

  console.log("-=-=-    ADDING LOAN PROPOSALS    -=-=-");

  let loanProposals = [];
  let lenderLoanProposal = [];
  for (const lender of lenders) {
    const nProposals = randomInt(2, loanRequests.length);
    const chosenRequests = choose(loanRequests, nProposals).map(
      (requets) => requets.id
    );
    for (const request of loanRequests) {
      if (chosenRequests.includes(request.id)) {
        const report = reports.find(
          (item) => request.borrower_id == item.borrower_id
        );
        const proposal = createLoanProposal(request, report, lender);
        loanProposals.push(proposal);
      } else {
        const favorite = choose([true, false]);
        const item = {
          lender_id: lender.id,
          loan_request_id: request.id,
          favorite: favorite,
          hide: !favorite,
        };
        lenderLoanProposal.push(item);
      }
    }
  }
  loanProposals = await db.many(addLoanProposalsQuery(loanProposals));
  lenderLoanProposal = await db.many(
    addLenderLoanProposalQuery(lenderLoanProposal)
  );
  // console.log(loanProposals.map((item, idx) => `${idx + 1} - ${item.id}`));
  console.log(`${colors.yellow(loanProposals.length)} Loan Proposals Added.`);
  console.log(
    `${colors.yellow(lenderLoanProposal.length)} Lender Loan Proposals Added.`
  );
  console.log("-=-=-    ADDING DATA TO MAIL LIST    -=-=-");
  const mailList = await db.many(addToMailListQuery(users));
  // console.log(mailList.map((item, idx) => `${idx + 1} - ${item.id}`));
  console.log(`${colors.yellow(mailList.length)} Emails Added.`);
}

async function run() {
  console.log("**************************");
  console.log("*   PREPARING DATABASE   *");
  console.log(`*       BE PATIENT       *`);
  console.log("**************************");
  await seed(10, 100, 10);
  console.log("******************");
  console.log("*    ALL DONE    *");
  console.log("******************");
}

run();
