// SS ENGINE - USER AUTHENTICATION

const crypto = require("crypto");

const users = new Map();

function signup(email, password) {
  if (!email || !password || password.length < 8) {
    throw new Error("Valid email and password required");
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (users.has(normalizedEmail)) {
    throw new Error("User already exists");
  }

  const salt = crypto.randomBytes(16).toString("hex");

  const passwordHash = crypto
    .scryptSync(password, salt, 64)
    .toString("hex");

  const user = {
    id: crypto.randomUUID(),
    email: normalizedEmail,
    salt,
    passwordHash,
    plan: "free"
  };

  users.set(normalizedEmail, user);

  return {
    id: user.id,
    email: user.email,
    plan: user.plan
  };
}

function login(email, password) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const user = users.get(normalizedEmail);

  if (!user || typeof password !== "string") {
    throw new Error("Invalid email or password");
  }

  const hash = crypto.scryptSync(password, user.salt, 64);

  const savedHash = Buffer.from(user.passwordHash, "hex");

  if (
    hash.length !== savedHash.length ||
    !crypto.timingSafeEqual(hash, savedHash)
  ) {
    throw new Error("Invalid email or password");
  }

  return {
    id: user.id,
    email: user.email,
    plan: user.plan
  };
}

module.exports = { signup, login };
