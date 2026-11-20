// SS ENGINE - PAYMENT CONTROLLER

const plans = {
  starter: { price: 99, credits: 500 },
  basic: { price: 299, credits: 2000 },
  creator: { price: 599, credits: 5000 },
  pro: { price: 1499, credits: 15000 },
  premium: { price: 2999, credits: 40000 },
  ultimate: { price: 5999, credits: 100000 }
};

function getPlans(req, res) {
  res.json({
    success: true,
    currency: "INR",
    plans
  });
}

function createPayment(req, res) {
  const { plan } = req.body;

  if (!plans[plan]) {
    return res.status(400).json({
      success: false,
      error: "Invalid recharge plan"
    });
  }

  // वास्तविक Payment Gateway अभी जोड़ा नहीं गया है।
  // यह केवल plan details देता है, भुगतान नहीं लेता।

  res.status(501).json({
    success: false,
    message: "Payment gateway is not configured yet",
    plan,
    amount: plans[plan].price,
    credits: plans[plan].credits
  });
}

module.exports = {
  getPlans,
  createPayment
};
