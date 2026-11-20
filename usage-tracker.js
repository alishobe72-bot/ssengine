// SS ENGINE - AI USAGE TRACKER

const { getPlan } = require("./usage-limits");

// Temporary usage storage
// Note: Server restart होने पर यह डेटा reset हो जाएगा।
const usageData = new Map();

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function getUsage(userId) {
  const today = getToday();
  const current = usageData.get(userId);

  if (!current || current.date !== today) {
    const fresh = {
      date: today,
      messages: 0,
      creditsUsed: 0
    };

    usageData.set(userId, fresh);
    return fresh;
  }

  return current;
}

function checkLimit(userId, planName = "free") {
  const plan = getPlan(planName);
  const usage = getUsage(userId);

  return {
    allowed: usage.messages < plan.dailyMessages,
    messagesUsed: usage.messages,
    dailyLimit: plan.dailyMessages,
    remaining: Math.max(
      0,
      plan.dailyMessages - usage.messages
    )
  };
}

function recordUsage(userId, credits = 1) {
  const usage = getUsage(userId);

  usage.messages += 1;
  usage.creditsUsed += credits;

  return usage;
}

module.exports = {
  getUsage,
  checkLimit,
  recordUsage
};
