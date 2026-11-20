// SS ENGINE - USER DATABASE MODEL

const { pool } = require("./database");

async function createUser(email, passwordHash, salt) {
  const query = `
    INSERT INTO users (email, password_hash, salt, plan)
    VALUES ($1, $2, $3, $4)
    RETURNING id, email, plan, created_at
  `;

  const result = await pool.query(query, [
    email.trim().toLowerCase(),
    passwordHash,
    salt,
    "free"
  ]);

  return result.rows[0];
}

async function findUserByEmail(email) {
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email.trim().toLowerCase()]
  );

  return result.rows[0] || null;
}

async function findUserById(id) {
  const result = await pool.query(
    `SELECT id, email, plan, created_at
     FROM users WHERE id = $1`,
    [id]
  );

  return result.rows[0] || null;
}

async function createUsersTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      plan VARCHAR(50) DEFAULT 'free',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  createUsersTable
};
