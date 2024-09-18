// server.js

/* Dependencies */
const app = require("./app.js");
const colors = require("colors");

/* Configuration */
require("dotenv").config();
const PORT = process.env.PORT;

/* Listen */
app.listen(PORT, () => {
  console.log(
    "Server is listening on port: ".yellow +
      `${PORT}`.brightRed +
      "\nURL: ".yellow +
      `http://localhost:${PORT}`.brightRed
  );
});
