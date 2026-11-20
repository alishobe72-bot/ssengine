// SS ENGINE - AI USAGE LIMITS

const PLANS = {
  free: {
    name: "Free",
    dailyMessages: 20,
    credits: 0
  },

  basic: {
    name: "Basic",
    dailyMessages: 100,
    credits: 0
  },

  starter: {
    name: "Starter",
    dailyMessages: 500,
    credits: 500,
    priceINR: 99
  },

  creator: {
    name: "Creator",
    dailyMessages: 5000,
    credits: 5000,
    priceINR: 599
  },

  pro: {
    name: "Pro",
    dailyMessages: 15000,
    credits: 15000,
    priceINR: 1499
  }
};

function getPlan(planName) {
  return PLANS[planName] || PLANS.free;
}

module.exports = {
  PLANS,
  getPlan
};
