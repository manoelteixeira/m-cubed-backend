const colors = require("colors");
const pgp = require("pg-promise")();
require("dotenv").config();

const cn = {
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
};

const db = pgp(cn);

db.connect()
  .then((cn) => {
    const { user, host, port, database } = cn.client;

    console.log(
      colors.blue("\n-=-=-=-\n"),
      colors.blue("Postgres connection established with:\n"),
      colors.blue(`User: ${colors.yellow(user)}\n`),
      colors.blue(`Host: ${colors.yellow(host)}\n`),
      colors.blue(`Port: ${colors.yellow(port)}\n`),
      colors.blue(`Database: ${colors.yellow(database)}\n`),
      colors.blue("-=-=-=-\n")
    );
    cn.done();
  })
  .catch((error) => console.log("database connection error", error));

module.exports = db;
