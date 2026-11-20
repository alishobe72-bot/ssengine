// SS ENGINE - REQUEST VALIDATOR

function validateAIRequest(req, res, next) {
  const { message, provider, history } = req.body;

  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({
      success: false,
      error: "Please enter a valid message"
    });
  }

  if (message.length > 10000) {
    return res.status(400).json({
      success: false,
      error: "Message is too long"
    });
  }

  const allowedProviders = [
    "main",
    "coding",
    "research",
    "creator",
    "backup"
  ];

  if (provider && !allowedProviders.includes(provider)) {
    return res.status(400).json({
      success: false,
      error: "Invalid AI provider"
    });
  }

  if (history !== undefined && !Array.isArray(history)) {
    return res.status(400).json({
      success: false,
      error: "Invalid chat history"
    });
  }

  next();
}

module.exports = validateAIRequest;
