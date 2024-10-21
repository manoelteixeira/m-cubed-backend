// app.js

/* Dependencies */
const colors = require("colors");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const loginController = require("./src/controllers/loginController");
const borrowersController = require("./src/controllers/borrowersController");
const lendersController = require("./src/controllers/lendersController");
const mailListController = require("./src/controllers/mailListController");

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
  // apis: ["./src/controllers/*.js"],
  apis: [
    "./src/controllers/mailListController.js",
    "./src/controllers/loginController.js",
    "./src/controllers/borrowersController.js",
    "./src/controllers/borrowersRequestsController.js",
    "./src/controllers/borrowersRequestProposalsController.js",
    "./src/controllers/lendersController.js",
    "./src/controllers/lendersProposalsController.js",
    "./src/controllers/lendersRequestsController.js",
  ],
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);
const app = express();
// Middleware
app.use(cors());
app.use(express.json());
// app.use(morgan("tiny"));
app.use(
  morgan(function (tokens, req, res) {
    return [
      colors.red(tokens.method(req, res)),
      colors.blue(tokens.url(req, res)),
      colors.yellow(tokens.status(req, res)),
      colors.magenta(tokens.res(req, res, "content-length")),
      "-",
      colors.green(tokens["response-time"](req, res)),
      colors.green("ms"),
    ].join(" ");
  })
);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use("/login", loginController);
app.use("/borrowers", borrowersController);
app.use("/lenders", lendersController);
app.use("/mail-list", mailListController);

app.get("/", (req, res) => {
  res.status(200).json({ index: "Money Money Money." });
});

app.get("*", (req, res) => {
  res.status(404).send({ error: "Not Found!" });
});
/* Export */
module.exports = app;
