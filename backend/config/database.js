import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error("Failed to connect to the database:", err.stack);
  } else {
    console.log("Successfully connected to the database");
    release(); // Release the client back to the pool
  }
});
//Tets
module.exports = pool;
