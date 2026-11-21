// ======================================
// SS ENGINE - DATABASE CONNECTION
// ======================================

const { Pool } = require("pg");

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL is not configured.");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false,

  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});

// ======================================
// CONNECT DATABASE
// ======================================

async function connectDatabase() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing");
  }

  try {
    await pool.query("SELECT 1");
    console.log("SS ENGINE Database Connected");
    return true;
  } catch (error) {
    console.error("Database Connection Failed:", error.message);
    throw error;
  }
}

// ======================================
// DATABASE QUERY
// ======================================

async function query(text, params = []) {
  return pool.query(text, params);
}

// ======================================
// CLOSE DATABASE
// ======================================

async function closeDatabase() {
  await pool.end();
  console.log("Database Connection Closed");
}

// ======================================
// EXPORT
// ======================================

module.exports = {
  pool,
  query,
  connectDatabase,
  closeDatabase
};
