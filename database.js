// SS ENGINE - DATABASE CONNECTION

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false
});

async function connectDatabase() {
  try {
    await pool.query("SELECT 1");
    console.log("SS ENGINE Database Connected");
  } catch (error) {
    console.error("Database Connection Failed:", error.message);
    throw error;
  }
}

module.exports = {
  pool,
  connectDatabase
};
