// ======================================
// SS ENGINE - AUTHENTICATION API ROUTES
// ======================================

const express = require("express");

const router = express.Router();

const { signup, login } = require("./auth");

const rateLimiter = require("./rate-limiter");

// ======================================
// SIGNUP ROUTE
// ======================================

router.post("/signup", rateLimiter, async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required"
      });
    }

    const result = await signup(email, password);

    return res.status(201).json(result);

  } catch (error) {
    if (error.message === "User already exists") {
      return res.status(409).json({
        success: false,
        error: "Account already exists"
      });
    }

    if (
      error.message === "Invalid email address" ||
      error.message === "Password must be 8 to 128 characters" ||
      error.message === "Valid email and password required"
    ) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    console.error("Signup Error:", error.message);

    return res.status(503).json({
      success: false,
      error: "Signup service unavailable"
    });
  }
});

// ======================================
// LOGIN ROUTE
// ======================================

router.post("/login", rateLimiter, async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required"
      });
    }

    const result = await login(email, password);

    return res.status(200).json(result);

  } catch (error) {
    if (error.message === "Invalid email or password") {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password"
      });
    }

    console.error("Login Error:", error.message);

    return res.status(503).json({
      success: false,
      error: "Login service unavailable"
    });
  }
});

// ======================================
// EXPORT
// ======================================

module.exports = router;
