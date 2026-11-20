// ======================================
// SS ENGINE - AI BACKEND
// ======================================

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT || 3000;

// ======================================
// AI API CONFIGURATION
// ======================================

const AI_PROVIDERS = {
  main: {
    key: process.env.MAIN_AI_KEY,
    url: process.env.MAIN_AI_URL,
    model: process.env.MAIN_AI_MODEL
  },

  coding: {
    key: process.env.CODING_AI_KEY,
    url: process.env.CODING_AI_URL,
    model: process.env.CODING_AI_MODEL
  },

  research: {
    key: process.env.RESEARCH_AI_KEY,
    url: process.env.RESEARCH_AI_URL,
    model: process.env.RESEARCH_AI_MODEL
  },

  creator: {
    key: process.env.CREATOR_AI_KEY,
    url: process.env.CREATOR_AI_URL,
    model: process.env.CREATOR_AI_MODEL
  },

  backup: {
    key: process.env.BACKUP_AI_KEY,
    url: process.env.BACKUP_AI_URL,
    model: process.env.BACKUP_AI_MODEL
  }
};

// ======================================
// HOME
// ======================================

app.get("/", (req, res) => {
  res.json({
    name: "SS ENGINE",
    version: "1.0",
    status: "Backend Online"
  });
});

// ======================================
// CHECK AI CONNECTIONS
// ======================================

app.get("/api/status", (req, res) => {
  const status = {};

  for (const name in AI_PROVIDERS) {
    const ai = AI_PROVIDERS[name];

    status[name] = {
      configured: Boolean(
        ai.key && ai.url && ai.model
      )
    };
  }

  res.json({
    system: "SS AI CONTROL CENTER",
    providers: status
  });
});

// ======================================
// AI CHAT SYSTEM
// ======================================

app.post("/api/chat", async (req, res) => {
  try {
    const {
      message,
      provider = "main",
      history = []
    } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    if (message.length > 20000) {
      return res.status(400).json({
        error: "Message is too long"
      });
    }

    const ai = AI_PROVIDERS[provider];

    if (!ai) {
      return res.status(400).json({
        error: "Unknown AI provider"
      });
    }

    if (!ai.key || !ai.url || !ai.model) {
      return res.status(503).json({
        error: "AI API is not configured"
      });
    }

    const messages = [
      {
        role: "system",
        content:
          "You are SS ENGINE AI Assistant. Help users create games, apps, websites, 3D models and digital products. Explain limitations honestly."
      },
      ...history.slice(-15),
      {
        role: "user",
        content: message
      }
    ];

    const response = await fetch(ai.url, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ai.key}`
      },

      body: JSON.stringify({
        model: ai.model,
        messages: messages,
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(502).json({
        error: "AI provider request failed"
      });
    }

    const answer =
      data.choices?.[0]?.message?.content;

    if (!answer) {
      return res.status(502).json({
        error: "AI returned an empty response"
      });
    }

    res.json({
      success: true,
      provider: provider,
      answer: answer
    });

  } catch (error) {
    console.error("SS AI Error:", error.message);

    res.status(500).json({
      error: "SS AI server error"
    });
  }
});

// ======================================
// SERVER START
// ======================================

app.listen(PORT, () => {
  console.log(
    `SS ENGINE Backend running on port ${PORT}`
  );
});
