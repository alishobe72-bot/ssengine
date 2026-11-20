// SS ENGINE - API RATE LIMITER

const requests = new Map();

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 30;

function rateLimiter(req, res, next) {
  const ip = req.ip || "unknown";
  const now = Date.now();

  let record = requests.get(ip);

  if (!record || now - record.start >= WINDOW_MS) {
    record = {
      start: now,
      count: 0
    };
  }

  record.count++;
  requests.set(ip, record);

  if (record.count > MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      error: "Too many requests. Please try again later."
    });
  }

  next();
}

module.exports = rateLimiter;
