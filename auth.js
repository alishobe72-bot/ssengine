// ======================================
// SS ENGINE - USER AUTHENTICATION
// ======================================

const crypto = require("crypto");
const {
  createUser,
  findUserByEmail
} = require("./user-model");

const { promisify } = require("util");
const scrypt = promisify(crypto.scrypt);

// ======================================
// EMAIL VALIDATION
// ======================================

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ======================================
// PASSWORD HASH
// ======================================

async function hashPassword(password, salt) {
  const hash = await scrypt(password, salt, 64);
  return hash.toString("hex");
}

// ======================================
// SIGNUP
// ======================================

async function signup(email, password) {
  if (
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    throw new Error("Valid email and password required");
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!isValidEmail(normalizedEmail)) {
    throw new Error("Invalid email address");
  }

  if (password.length < 8 || password.length > 128) {
    throw new Error("Password must be 8 to 128 characters");
  }

  const existingUser = await findUserByEmail(normalizedEmail);

  if (existingUser) {
    throw new Error("User already exists");
  }

  const salt = crypto.randomBytes(16).toString("hex");

  const passwordHash = await hashPassword(password, salt);

  const user = await createUser({
    email: normalizedEmail,
    passwordHash,
    salt
  });

  return {
    id: user.id,
    email: user.email,
    plan: user.plan
  };
}

// ======================================
// LOGIN
// ======================================

async function login(email, password) {
  if (
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    throw new Error("Invalid email or password");
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await findUserByEmail(normalizedEmail);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordHash = await hashPassword(
    password,
    user.salt
  );

  const savedHash = Buffer.from(
    user.password_hash,
    "hex"
  );

  const enteredHash = Buffer.from(
    passwordHash,
    "hex"
  );

  if (
    savedHash.length !== enteredHash.length ||
    !crypto.timingSafeEqual(savedHash, enteredHash)
  ) {
    throw new Error("Invalid email or password");
  }

  return {
    id: user.id,
    email: user.email,
    plan: user.plan
  };
}

// ======================================
// EXPORT
// ======================================

module.exports = {
  signup,
  login
};
