// SS ENGINE - AI PROVIDER CONFIGURATION

const AI_PROVIDERS = {
  main: {
    name: "Main AI",
    key: process.env.MAIN_AI_KEY,
    url: process.env.MAIN_AI_URL,
    model: process.env.MAIN_AI_MODEL
  },

  coding: {
    name: "Coding AI",
    key: process.env.CODING_AI_KEY,
    url: process.env.CODING_AI_URL,
    model: process.env.CODING_AI_MODEL
  },

  research: {
    name: "Research AI",
    key: process.env.RESEARCH_AI_KEY,
    url: process.env.RESEARCH_AI_URL,
    model: process.env.RESEARCH_AI_MODEL
  },

  creator: {
    name: "Creator AI",
    key: process.env.CREATOR_AI_KEY,
    url: process.env.CREATOR_AI_URL,
    model: process.env.CREATOR_AI_MODEL
  },

  backup: {
    name: "Backup AI",
    key: process.env.BACKUP_AI_KEY,
    url: process.env.BACKUP_AI_URL,
    model: process.env.BACKUP_AI_MODEL
  }
};

module.exports = AI_PROVIDERS;
