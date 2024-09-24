const express = require("express");
const requests = express.Router({ mergeParams: true });
const {
  getAllLoanRequests,
  getAllLoanRequestsByLenderID,
  getLoanRequestByID,
  createLoanRequest,
} = require("../queries/lendersRequestsQueries");

// Get all loan requests (no filter)
//URL: GET /api/lenders/requests/all
//localhost:4001/lenders/requests/all
requests.get("/all", async (req, res) => {
  try {
    const loanRequests = await getAllLoanRequests();
    res.status(200).json(loanRequests);
  } catch (error) {
    console.error("Error fetching all loan requests:", error);
    res.status(500).json({ error: "Failed to fetch loan requests" });
  }
});

// Get all loan requests for a specific lender
//URL: GET /api/lenders/requests/lender/:lender_id
//localhost:4001/lenders/requests/lender/1
requests.get("/lender/:lender_id", async (req, res) => {
  const { lender_id } = req.params;
  try {
    const loanRequests = await getAllLoanRequestsByLenderID(lender_id);
    if (loanRequests.length > 0) {
      res.status(200).json(loanRequests);
    } else {
      res.status(404).json({ error: "No loan requests found for this lender" });
    }
  } catch (error) {
    console.error("Error fetching loan requests for lender:", error);
    res.status(500).json({ error: "Failed to fetch loan requests" });
  }
});

// Get a single loan request by loan_request_id
//URL: GET /api/lenders/requests/:loan_request_id
//localhost:4001/lenders/requests/1
requests.get("/:loan_request_id", async (req, res) => {
  const { loan_request_id } = req.params;
  try {
    const loanRequest = await getLoanRequestByID(loan_request_id);
    if (loanRequest) {
      res.status(200).json(loanRequest);
    } else {
      res.status(404).json({ error: "Loan request not found" });
    }
  } catch (error) {
    console.error("Error fetching loan request by ID:", error);
    res.status(500).json({ error: "Failed to fetch loan request" });
  }
});

// Create a new loan request
// URL: POST /api/lenders/requests
// localhost:4001/lenders/requests
requests.post("/", async (req, res) => {
  const requestData = req.body;
  try {
    const newLoanRequest = await createLoanRequest(requestData);
    res.status(201).json(newLoanRequest);
  } catch (error) {
    console.error("Error creating new loan request:", error);
    res.status(500).json({ error: "Failed to create loan request" });
  }
});

module.exports = requests;
