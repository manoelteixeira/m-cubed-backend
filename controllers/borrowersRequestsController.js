// controllers/borrowersRequestsController.js
/* Dependencies */
const express = require("express");
const {
  getRequest,
  getRequests,
  deleteRequest,
  createRequest,
  updateRequest,
} = require("../queries/borrowersRequestsQueries");

const {
  validateTitle,
  validateDescription,
  validateValue,
  validateCreatedAt,
} = require("../validators/borrowersRequestsValidators");

const requestProposalsController = require("./borrowersRequestProposalsController");

/* Configurations */
const requestsController = express.Router({ mergeParams: true });
requestsController.use("/:request_id/proposals", requestProposalsController);

/* Routes */

/**
 * GET all request for a given borrower
 * ROUTE: localhost:4001/:borrower_id/requests
 */
requestsController.get("/", async (req, res) => {
  console.log(req.user);
  const { borrower_id } = req.params;
  try {
    const requests = await getRequests(Number(borrower_id));
    res.status(200).json(requests);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

/**
 * CREATE a new loan request
 * ROUTE: localhost:4001/:borrower_id/requests
 */
requestsController.post(
  "/",
  validateTitle,
  validateDescription,
  validateValue,
  validateCreatedAt,
  async (req, res) => {
    const { borrower_id } = req.params;
    try {
      const request = await createRequest({
        ...req.body,
        borrower_id: Number(borrower_id),
      });
      console.log(request);
      if (request.id) {
        res.status(200).json(request);
      } else {
        res.status(400).json(request);
      }
    } catch (err) {
      res.status(400).json({ error: err });
    }
  }
);

/**
 * GET a sinlge request from a given borrower
 * ROUTE: localhost:4001/:borrower_id/requests/:id
 */
requestsController.get("/:id", async (req, res) => {
  const { borrower_id, id } = req.params;
  try {
    const request = await getRequest(Number(borrower_id), Number(id));
    if (request.id) {
      res.status(200).json(request);
    } else {
      res.status(404).json({ error: "Request not found." });
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

/**
 * UPDATE a single loan request
 * ROUTE: localhost:4001/:borrower_id/requests/:id
 */
requestsController.put(
  "/:id",
  validateTitle,
  validateDescription,
  validateValue,
  async (req, res) => {
    const { borrower_id, id } = req.params;
    try {
      const request = await updateRequest({
        ...req.body,
        borrower_id: Number(borrower_id),
        id: Number(id),
      });
      if (request.id) {
        res.status(200).json(request);
      } else {
        res.status(404).json({ error: "Request not found." });
      }
    } catch (err) {
      res.status(400).send(err);
    }
  }
);

/**
 * DELETE a loan request
 * ROUTE: localhost:4001/:borrower_id/requests/:id
 */
requestsController.delete("/:id", async (req, res) => {
  const { borrower_id, id } = req.params;
  try {
    const request = await deleteRequest(Number(borrower_id), Number(id));
    if (request.id) {
      res.status(200).json(request);
    } else {
      res.status(404).json({ error: "Request not found." });
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = requestsController;
