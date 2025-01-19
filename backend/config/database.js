const pg = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pool = new pg.Pool({
  user: "postgres",
  password: "12345678",
  host: "localhost",
  port: "5432",
  database: "campusplus",
});

// Test the database connection
(async () => {
  try {
    const client = await pool.connect();
    console.log("Successfully connected to the database!");
    client.release(); // Release the client back to the pool
  } catch (err) {
    console.error("Database connection error:", err.message);
  }
})();

module.exports = pool; // Export the pool for use in other files
