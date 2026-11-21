// ======================================
// SS ENGINE - MAIN BACKEND SERVER
// ======================================

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const AI_PROVIDERS = require("./ai-providers");
const aiRoutes = require("./ai-routes");
const authRoutes = require("./auth-routes");

const { connectDatabase } = require("./database");
const { createUsersTable } = require("./user-model");

const app = express();
const PORT = process.env.PORT || 3000;

// ======================================
// SECURITY
// ======================================

const allowedOrigins = (process.env.FRONTEND_ORIGIN || "")
  .split(",")
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Origin not allowed"));
  }
}));

app.use(helmet());

app.use(express.json({
  limit: "1mb"
}));

// ======================================
// HOME
// ======================================

app.get("/", (req, res) => {
  res.json({
    name: "SS ENGINE",
    version: "1.0",
    status: "Backend Online",
    message: "Welcome to SS ENGINE"
  });
});

// ======================================
// AI CONTROL CENTER STATUS
// ======================================

app.get("/api/status", (req, res) => {
  const providers = {};

  for (const name in AI_PROVIDERS) {
    const ai = AI_PROVIDERS[name];

    providers[name] = {
      configured: Boolean(
        ai.key && ai.url && ai.model
      )
    };
  }

  res.json({
    system: "SS AI CONTROL CENTER",
    status: "Online",
    providers
  });
});

// ======================================
// AI API ROUTES
// ======================================

app.use("/api", aiRoutes);

// ======================================
// AUTHENTICATION API ROUTES
// ======================================

app.use("/api/auth", authRoutes);

// Signup: POST /api/auth/signup
// Login:  POST /api/auth/login

// ======================================
// 404 NOT FOUND
// ======================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "API route not found"
  });
});

// ======================================
// GLOBAL ERROR HANDLER
// ======================================

app.use((error, req, res, next) => {
  console.error("SS ENGINE Error:", error.message);

  res.status(error.status || 500).json({
    success: false,
    error: "Server error"
  });
});

// ======================================
// START SERVER
// ======================================

async function startServer() {
  try {
    await connectDatabase();

    await createUsersTable();

    app.listen(PORT, () => {
      console.log(
        `SS ENGINE Backend running on port ${PORT}`
      );
    });

  } catch (error) {
    console.error(
      "SS ENGINE Startup Failed:",
      error.message
    );

    process.exit(1);
  }
}

startServer();
