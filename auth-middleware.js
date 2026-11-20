// SS ENGINE - AUTHENTICATION MIDDLEWARE

function authMiddleware(req, res, next) {
  const userId = req.headers["x-user-id"];

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: "Authentication required"
    });
  }

  // Temporary placeholder:
  // Real token verification and database lookup
  // must be implemented before deployment.

  return res.status(401).json({
    success: false,
    error: "Secure authentication is not configured yet"
  });
}

module.exports = authMiddleware;
