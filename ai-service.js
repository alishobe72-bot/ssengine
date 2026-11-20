// SS ENGINE - AI SERVICE

const AI_PROVIDERS = require("./ai-providers");

async function generateAIResponse(providerName, messages) {
  const provider = AI_PROVIDERS[providerName];

  if (!provider) {
    throw new Error("AI provider not found");
  }

  if (!provider.key || !provider.url || !provider.model) {
    throw new Error("AI provider is not configured");
  }

  const response = await fetch(provider.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${provider.key}`
    },
    body: JSON.stringify({
      model: provider.model,
      messages,
      temperature: 0.7
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error("AI provider request failed");
  }

  const answer = data.choices?.[0]?.message?.content;

  if (!answer) {
    throw new Error("AI returned an empty response");
  }

  return answer;
}

module.exports = { generateAIResponse };
