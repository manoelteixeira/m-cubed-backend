const db = require("../db/dbConfig.js");
const {
  createCreditReport: newCreditReport,
} = require("../utils/dataFactories.js");

async function getCreditReports(id) {
  const queryStr =
    "SELECT * FROM credit_reports " +
    "WHERE borrower_id=$[id]" +
    "ORDER BY expire_at ASC ";
  try {
    const reports = await db.many(queryStr, { id });
    return reports;
  } catch (error) {
    return { error: "No report found." };
  }
}

// async function createCreditReport(id) {
//   const report = newCreditReport(id);
//   const queryStr =
//     "INSERT INTO credit_reports (credit_bureau, report_id, score, created_at, expire_at, borrower_id) " +
//     "VALUES ('$[credit_bureau]', '$[report_id]', $[score], '$[created_at]', '$[expire_at]', '$[borrower_id]') " +
//     "RETURNING *";
// }

module.exports = {
  getCreditReports,
  //   createCreditReport,
};
