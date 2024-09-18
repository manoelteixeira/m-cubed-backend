// app.js

/* Dependencies */
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { error } = require("console");

/* Configuration */
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.get("/", (req, res) => {
  res.status(200).json({ index: "Money Money Money." });
});

/* Export */
module.exports = app;
