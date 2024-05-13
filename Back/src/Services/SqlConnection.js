const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: "localhost",
  user: process.env.MY_USER,
  database: process.env.MY_DATA_BASE,
  password: process.env.MY_DATA_PASSWORD,
  waitForConnections: true,
  multipleStatements: true,
});

module.exports = { pool };
