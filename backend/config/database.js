const pg = require("pg");
const dotenv = require("dotenv");
dotenv.config();

const pool = new pg.Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  }
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
