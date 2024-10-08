// app.js

/* Dependencies */
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const loginController = require("./controllers/loginController");
const borrowersController = require("./controllers/borrowersController");
const lendersController = require("./controllers/lendersController");

/* Configuration */
const swaggerOptions = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "M-Cubed API",
      description: "M-Cubed API Documentation",
      contact: {
        name: "Team 5",
      },
    },
    servers: [
      {
        description: "localhost",
        url: "http://localhost:4001",
      },
      {
        description: "m-cubed",
        url: "https://m-cubed-backend.onrender.com",
      },
    ],
  },
  // apis: ["./controllers/*.js"],
  apis: [
    "./controllers/loginController.js",
    "./controllers/borrowersController.js",
    "./controllers/borrowersRequestsController.js",
    "./controllers/borrowersRequestProposalsController.js",
    "./controllers/lendersController.js",
    "./controllers/lendersProposalsController.js",
    "./controllers/lendersRequestsController.js",
  ],
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);
const app = express();
// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use("/login", loginController);
app.use("/borrowers", borrowersController);
app.use("/lenders", lendersController);

app.get("/", (req, res) => {
  res.status(200).json({ index: "Money Money Money." });
});

app.get("*", (req, res) => {
  res.status(404).send({ error: "Not Found!" });
});
/* Export */
module.exports = app;
