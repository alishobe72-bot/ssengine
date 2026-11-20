// SS ENGINE - GLOBAL ERROR HANDLER

function errorHandler(err, req, res, next) {
  console.error("SS ENGINE ERROR:", err.message);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error:
      statusCode === 500
        ? "Internal server error"
        : err.message
  });
}

module.exports = errorHandler;
