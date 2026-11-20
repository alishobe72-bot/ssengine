// SS ENGINE - Backend Health Check

function healthCheck(req, res) {
  res.status(200).json({
    success: true,
    name: "SS ENGINE",
    service: "Backend",
    status: "Online",
    message: "SS ENGINE backend is running",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  });
}

module.exports = healthCheck;
