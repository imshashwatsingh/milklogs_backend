import pg from "pg";

// Ensure that the environment variables are loaded
import dotenv from "dotenv";
dotenv.config();

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

db.connect();

export default db;

export const testDB = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users");
    console.log("Database Rows:", result.rows);
    res.status(200).json({ message: "Database connection successful", data: result.rows });
  } catch (error) {
    console.error("Database Connection Error:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
};