// ======================================
// SS ENGINE - AUTHENTICATION MIDDLEWARE
// ======================================

const { verifyToken } = require("./auth");

const { findUserById } = require("./user-model");

// ======================================
// AUTHENTICATION CHECK
// ======================================

async function authMiddleware(req, res, next) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Authentication required"
      });
    }

    const token = authorization.slice(7).trim();

    if (!token || token.length > 4096) {
      return res.status(401).json({
        success: false,
        error: "Invalid authentication token"
      });
    }

    const payload = verifyToken(token);

    const user = await findUserById(payload.sub);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "User account not found"
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      plan: user.plan
    };

    next();

  } catch (error) {
    if (
      error.message === "Invalid token" ||
      error.message === "Token expired or invalid" ||
      error.message === "Invalid authentication token"
    ) {
      return res.status(401).json({
        success: false,
        error: "Invalid or expired token"
      });
    }

    if (error.message.includes("AUTH_TOKEN_SECRET")) {
      return res.status(503).json({
        success: false,
        error: "Authentication is not configured"
      });
    }

    console.error("Authentication Error:", error.message);

    return res.status(503).json({
      success: false,
      error: "Authentication service unavailable"
    });
  }
}

// ======================================
// EXPORT
// ======================================

module.exports = authMiddleware;
