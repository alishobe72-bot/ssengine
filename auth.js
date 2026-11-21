// ======================================
// SS ENGINE - USER AUTHENTICATION
// ======================================

const crypto = require("crypto");
const { promisify } = require("util");

const scrypt = promisify(crypto.scrypt);

const {
  createUser,
  findUserByEmail
} = require("./user-model");

// ======================================
// TOKEN CONFIGURATION
// ======================================

const TOKEN_LIFETIME = 7 * 24 * 60 * 60;

function getSecret() {
  const secret = process.env.AUTH_TOKEN_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("AUTH_TOKEN_SECRET must be at least 32 characters");
  }

  return secret;
}

// ======================================
// TOKEN GENERATION
// ======================================

function createToken(userId) {
  const now = Math.floor(Date.now() / 1000);

  const payload = {
    sub: String(userId),
    iat: now,
    exp: now + TOKEN_LIFETIME
  };

  const encoded = Buffer
    .from(JSON.stringify(payload))
    .toString("base64url");

  const signature = crypto
    .createHmac("sha256", getSecret())
    .update(encoded)
    .digest("base64url");

  return encoded + "." + signature;
}

// ======================================
// TOKEN VERIFICATION
// ======================================

function verifyToken(token) {
  if (typeof token !== "string") {
    throw new Error("Invalid token");
  }

  const parts = token.split(".");

  if (parts.length !== 2) {
    throw new Error("Invalid token");
  }

  const [encoded, receivedSignature] = parts;

  const expectedSignature = crypto
    .createHmac("sha256", getSecret())
    .update(encoded)
    .digest();

  const actualSignature = Buffer.from(
    receivedSignature,
    "base64url"
  );

  if (
    actualSignature.length !== expectedSignature.length ||
    !crypto.timingSafeEqual(actualSignature, expectedSignature)
  ) {
    throw new Error("Invalid token");
  }

  const payload = JSON.parse(
    Buffer.from(encoded, "base64url").toString("utf8")
  );

  const now = Math.floor(Date.now() / 1000);

  if (
    !payload.sub ||
    !Number.isSafeInteger(payload.exp) ||
    payload.exp <= now
  ) {
    throw new Error("Token expired or invalid");
  }

  return payload;
}

// ======================================
// PASSWORD HASHING
// ======================================

async function hashPassword(password, salt) {
  const hash = await scrypt(password, salt, 64);
  return hash.toString("hex");
}

// ======================================
// EMAIL VALIDATION
// ======================================

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

  const token = createToken(user.id);

  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      plan: user.plan
    },
    token
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

  const token = createToken(user.id);

  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      plan: user.plan
    },
    token
  };
}

// ======================================
// EXPORT
// ======================================

module.exports = {
  signup,
  login,
  verifyToken
};
