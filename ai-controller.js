// SS ENGINE - AI CONTROLLER

const { generateAIResponse } = require("./ai-service");
const { selectAI } = require("./ai-router");
const { recordUsage } = require("./usage-tracker");

async function chat(req, res) {
  try {
    const { message, task = "chat", history = [] } = req.body;

    const selectedAI = selectAI(task);

    const messages = [
      {
        role: "system",
        content:
          "You are SS ENGINE AI. Help users create games, apps, websites, images and digital products. Give accurate answers."
      },
      ...history
        .filter(item =>
          ["user", "assistant"].includes(item.role) &&
          typeof item.content === "string"
        )
        .slice(-10),
      {
        role: "user",
        content: message
      }
    ];

    const answer = await generateAIResponse(
      selectedAI.provider,
      messages
    );

    const userId = req.user?.id || req.ip || "guest";

    recordUsage(userId, 1);

    res.json({
      success: true,
      provider: selectedAI.provider,
      answer
    });

  } catch (error) {
    console.error("AI Controller Error:", error.message);

    res.status(500).json({
      success: false,
      error: "AI response could not be generated"
    });
  }
}

module.exports = { chat };
