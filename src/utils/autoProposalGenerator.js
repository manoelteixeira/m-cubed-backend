/************************************/
/*    REMOVE AFTER DEMO DAY !!!!    */
/************************************/

// src/utils/autoProposalGenerator.js
const db = require("../db/dbConfig.js");
const { choose } = require("./helpers.js");
const { createLoanProposal } = require("./dataFactories.js");
const { addLoanProposalsQuery } = require("./queryFactoies.js");

async function getLenders(num) {
  const queryStr =
    "SELECT * FROM lenders where business_name != 'Japanese Lending Firm'";
  try {
    const lenders = await db.many(queryStr);
    return choose(lenders, num);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function getCreditReport(borrowerID) {
  const queryStr =
    "SELECT * FROM credit_reports WHERE borrower_id=$[borrowerID]";
  try {
    const report = await db.one(queryStr, { borrowerID });
    return report;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function generateProposals(request, num) {
  try {
    const report = await getCreditReport(request.borrower_id);
    const lenders = await getLenders(num);
    let proposals = lenders.map((lender) =>
      createLoanProposal(request, report, lender)
    );
    const proposalsQuery = addLoanProposalsQuery(proposals);
    proposals = await db.many(proposalsQuery);
    return proposals;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

module.exports = generateProposals;
