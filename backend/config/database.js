const pg = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pool = new pg.Pool({
  user: "postgres",
  password: "123123",
  host: "localhost",
  port: "5432",
  database: "login",
});

pool.connect((err, client, release) => {
  if (err) {
    console.error("Failed to connect to the database:", err.stack);
  } else {
    console.log("Successfully connected to the database");
    release(); // Release the client back to the pool
  }
});


module.exports = pool;
