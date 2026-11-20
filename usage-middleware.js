// SS ENGINE - USAGE LIMIT MIDDLEWARE

const { checkLimit } = require("./usage-tracker");

function usageMiddleware(req, res, next) {
  // User authentication जोड़ने के बाद req.user मिलेगा।
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      success: false,
      error: "User authentication required"
    });
  }

  const userId = String(req.user.id);
  const planName = req.user.plan || "free";

  const limit = checkLimit(userId, planName);

  if (!limit.allowed) {
    return res.status(429).json({
      success: false,
      error: "Daily AI message limit reached",
      usage: limit
    });
  }

  req.aiUsage = {
    userId,
    planName,
    limit
  };

  next();
}

module.exports = usageMiddleware;
