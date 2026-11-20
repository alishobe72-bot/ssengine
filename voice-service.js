// SS ENGINE - VOICE AI SERVICE

const VOICE_API_URL = process.env.VOICE_API_URL;
const VOICE_API_KEY = process.env.VOICE_API_KEY;

async function generateSpeech(text) {
  if (!VOICE_API_URL || !VOICE_API_KEY) {
    throw new Error("Voice API is not configured");
  }

  if (!text || typeof text !== "string") {
    throw new Error("Valid text is required");
  }

  const response = await fetch(VOICE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${VOICE_API_KEY}`
    },
    body: JSON.stringify({
      text,
      language: "hi-IN"
    })
  });

  if (!response.ok) {
    throw new Error("Voice API request failed");
  }

  return response.arrayBuffer();
}

module.exports = {
  generateSpeech
};
