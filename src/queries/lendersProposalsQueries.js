const db = require("../db/dbConfig");

// Get all loan proposals made by a specific lender
const getAllLoanProposalsByLenderID = async (id) => {
  try {
    // const query = `SELECT * FROM loan_proposals WHERE lender_id = $1`;
    const query =
      "SELECT loan_proposals.id, loan_proposals.title, loan_proposals.description, loan_proposals.loan_amount,  " +
      "loan_proposals.interest_rate, loan_proposals.repayment_term, loan_proposals.created_at,  " +
      "loan_proposals.expire_at , loan_proposals.update_at , loan_proposals.status , loan_proposals.lender_id, " +
      "loan_proposals.loan_request_id, loan_requests.borrower_id as borrower_id " +
      "FROM loan_proposals JOIN loan_requests " +
      "ON loan_request_id = loan_requests.id " +
      "WHERE lender_id = $[id]";
    const allProposals = await db.any(query, { id });
    return allProposals;
  } catch (error) {
    // console.error("Error fetching all loan proposals for lender:", error);
    throw error;
  }
};

// Get a single loan proposal by lender ID and proposal ID
const getProposalByID = async (lender_id, proposal_id) => {
  try {
    const query = `SELECT * FROM loan_proposals WHERE lender_id = $1 AND id = $2`;
    const proposal = await db.oneOrNone(query, [lender_id, proposal_id]);
    return proposal;
  } catch (error) {
    console.error(
      `Error fetching loan proposal with ID ${proposal_id}:`,
      error
    );
    throw error;
  }
};

// Create a new loan proposal based on a loan request
const createProposalFromRequest = async (
  lender_id,
  request_id,
  proposalData
) => {
  try {
    const { title, description, accepted } = proposalData;
    const query = `
      INSERT INTO loan_proposals (lender_id, loan_request_id, title, description, created_at, accepted)
      VALUES ($1, $2, $3, $4, NOW(), $5)
      RETURNING *`;
    const newProposal = await db.one(query, [
      lender_id,
      request_id,
      title,
      description,
      accepted,
    ]);
    return newProposal;
  } catch (error) {
    console.error("Error creating loan proposal:", error);
    throw error;
  }
};

// Update a loan proposal by ID
const updateProposalByID = async (proposal) => {
  const proposalQuery = "SELECT * FROM loan_proposals WHERE id=$[id]";
  const updateProposalQuery =
    "UPDATE loan_proposals " +
    "SET title=$[title], description=$[description], loan_amount=$[loan_amount], " +
    "interest_rate=$[interest_rate], repayment_term=$[repayment_term], created_at=$[created_at], " +
    "expire_at=$[expire_at], update_at=$[date]" +
    "WHERE lender_id=$[lender_id] AND id=$[id] RETURNING *";

  try {
    const date = new Date().toISOString();
    const proposalData = await db.one(proposalQuery, { id: proposal.id });
    if (!proposalData.accepted) {
      const updatedProposal = await db.one(updateProposalQuery, {
        ...proposal,
        date,
      });
      return updatedProposal;
    } else {
      return { error: "Loan proposal can no longer be updated." };
    }
  } catch (error) {
    console.error(error);
    return error;
  }
};

// Delete a loan proposal by ID
const deleteProposalByID = async (lender_id, proposal_id) => {
  try {
    const query = `DELETE FROM loan_proposals WHERE lender_id = $1 AND id = $2 RETURNING *`;
    const deletedProposal = await db.oneOrNone(query, [lender_id, proposal_id]);
    return deletedProposal;
  } catch (error) {
    console.error(
      `Error deleting loan proposal with ID ${proposal_id}:`,
      error
    );
    throw error;
  }
};

module.exports = {
  getAllLoanProposalsByLenderID,
  getProposalByID,
  createProposalFromRequest,
  updateProposalByID,
  deleteProposalByID,
};
