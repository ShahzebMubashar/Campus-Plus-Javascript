const pg = require("pg");
const dotenv = require("dotenv");
dotenv.config();
require("dotenv").config();


const pool = new pg.Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
  // Connection management settings
  max: 10, // Limit max connections to prevent exhaustion
  idleTimeoutMillis: 60000, // Close idle connections after 1 minute
  connectionTimeoutMillis: 10000, // Fail fast if can't connect in 10 seconds
  allowExitOnIdle: true, // Allow pool to close when idle
});


// Test the database connection
(async () => {
  try {
    const client = await pool.connect();
    client.release(); // Release the client back to the pool
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection error:", err.message);
  }
})();

// // Connection monitoring and cleanup
// setInterval(async () => {
//   try {
//     const client = await pool.connect();
//     const result = await client.query(`
//       SELECT 
//         count(*) as total_connections,
//         count(*) FILTER (WHERE state = 'idle') as idle_connections,
//         count(*) FILTER (WHERE state = 'active') as active_connections
//       FROM pg_stat_activity 
//       WHERE datname = current_database()
//     `);
    
//     const stats = result.rows[0];
//     console.log(`DB Stats - Total: ${stats.total_connections}, Idle: ${stats.idle_connections}, Active: ${stats.active_connections}`);
    
//     // If too many idle connections, log a warning
//     if (stats.idle_connections > 5) {
//       console.warn(`Warning: ${stats.idle_connections} idle connections detected`);
//     }
    
//     client.release();
//   } catch (error) {
//     console.error("Connection monitoring error:", error.message);
//   }
// }, 60000); // Check every minute

module.exports = pool; // Export the pool for use in other files
