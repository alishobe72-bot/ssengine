// SS ENGINE - CREDIT MIDDLEWARE

const { getBalance } = require("./credit-service");

function creditMiddleware(req, res, next) {
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      success: false,
      error: "User authentication required"
    });
  }

  const plan = req.user.plan || "free";

  // Free plan usage is controlled by daily message limits.
  if (plan === "free") {
    return next();
  }

  const requiredCredits = 1;
  const balance = getBalance(req.user.id);

  if (balance < requiredCredits) {
    return res.status(402).json({
      success: false,
      error: "Insufficient AI credits",
      balance
    });
  }

  req.requiredCredits = requiredCredits;

  next();
}

module.exports = creditMiddleware;
