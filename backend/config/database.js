const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the database connection
(async () => {
  try {
    const client = await pool.getConnection();
    console.log("Successfully connected to the database!");
    client.release(); // Release the client back to the pool
  } catch (err) {
    console.error("Database connection error:", err.message);
  }
})();

module.exports = pool; // Export the pool for use in other files
