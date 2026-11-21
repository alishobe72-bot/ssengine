// ======================================
// SS ENGINE - USER MODEL
// ======================================

const { query } = require("./database");

// ======================================
// CREATE USERS TABLE
// ======================================

async function createUsersTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

      email VARCHAR(255) UNIQUE NOT NULL,

      password_hash TEXT NOT NULL,

      salt TEXT NOT NULL,

      plan VARCHAR(50) DEFAULT 'free',

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await query(sql);

  console.log("SS ENGINE Users Table Ready");
}

// ======================================
// CREATE USER
// ======================================

async function createUser({
  email,
  passwordHash,
  salt
}) {
  const sql = `
    INSERT INTO users (
      email,
      password_hash,
      salt
    )
    VALUES ($1, $2, $3)
    RETURNING id, email, plan, created_at;
  `;

  const result = await query(sql, [
    email.toLowerCase().trim(),
    passwordHash,
    salt
  ]);

  return result.rows[0];
}

// ======================================
// FIND USER BY EMAIL
// ======================================

async function findUserByEmail(email) {
  const sql = `
    SELECT *
    FROM users
    WHERE email = $1
    LIMIT 1;
  `;

  const result = await query(sql, [
    email.toLowerCase().trim()
  ]);

  return result.rows[0] || null;
}

// ======================================
// FIND USER BY ID
// ======================================

async function findUserById(id) {
  const result = await query(
    `SELECT id, email, plan, created_at
     FROM users
     WHERE id = $1
     LIMIT 1`,
    [id]
  );

  return result.rows[0] || null;
}

// ======================================
// UPDATE USER PLAN
// ======================================

async function updateUserPlan(id, plan) {
  const result = await query(
    `UPDATE users
     SET plan = $1
     WHERE id = $2
     RETURNING id, email, plan`,
    [plan, id]
  );

  return result.rows[0] || null;
}

// ======================================
// EXPORT
// ======================================

module.exports = {
  createUsersTable,
  createUser,
  findUserByEmail,
  findUserById,
  updateUserPlan
};
