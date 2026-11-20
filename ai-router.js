// SS ENGINE - AI ROUTER

const AI_PROVIDERS = require("./ai-providers");

function selectAI(task) {
  const type = String(task || "main").toLowerCase();

  const routes = {
    chat: "main",
    general: "main",
    coding: "coding",
    game: "coding",
    app: "coding",
    website: "coding",
    research: "research",
    science: "research",
    image: "creator",
    creator: "creator"
  };

  const selected = routes[type] || "main";
  const provider = AI_PROVIDERS[selected];

  return {
    provider: selected,
    name: provider.name,
    configured: Boolean(provider.key && provider.url && provider.model)
  };
}

module.exports = { selectAI };
