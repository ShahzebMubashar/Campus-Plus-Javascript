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

<<<<<<< HEAD
=======
pool.connect((err, client, release) => {
  if (err) {
    console.error("Failed to connect to the database:", err.stack);
  } else {
    console.log("Successfully connected to the database");
    release(); // Release the client back to the pool
<<<<<<< HEAD
>>>>>>> 9e6f5ac56e674826b6e77174f35d807c5d1648e1

(async () => {
  try {
    const client = await pool.connect();
    console.log("Connected to the database successfully!");
    client.release();
  } catch (err) {
    console.error("Database connection error:", err.message);
=======
>>>>>>> 6d087b1b07ff61fd9a6d5693ed342878c762c42b
  }
});

module.exports = pool;
console.log("Database connection pool created");
