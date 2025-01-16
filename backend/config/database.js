const pg = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pool = new pg.Pool({
  user: "postgres",
  password: "123123",
  host: "localhost",
  port: "5432",
  database: "auth_system",
});

(async () => {
  try {
    const client = await pool.connect();
    console.log("Connected to the database successfully!");
    client.release();
  } catch (err) {
    console.error("Database connection error:", err.message);
  }
})();

module.exports = pool;
