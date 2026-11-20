// SS ENGINE - AI API ROUTES

const express = require("express");

const router = express.Router();

const { chat } = require("./ai-controller");
const validateAIRequest = require("./request-validator");
const rateLimiter = require("./rate-limiter");

router.post(
  "/chat",
  rateLimiter,
  validateAIRequest,
  chat
);

module.exports = router;
