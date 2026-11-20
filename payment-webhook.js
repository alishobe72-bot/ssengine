// SS ENGINE - PAYMENT WEBHOOK

const crypto = require("crypto");

// Payment gateway की webhook signature जाँचता है।
function verifyWebhookSignature(rawBody, signature, secret) {
  if (!rawBody || !signature || !secret) {
    return false;
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  const received = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");

  if (received.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(received, expectedBuffer);
}

function paymentWebhook(req, res) {
  const secret = process.env.PAYMENT_WEBHOOK_SECRET;
  const signature = req.headers["x-payment-signature"];

  const rawBody = req.rawBody;

  if (
    !verifyWebhookSignature(rawBody, signature, secret)
  ) {
    return res.status(401).json({
      success: false,
      error: "Invalid payment signature"
    });
  }

  // असली Gateway Event Processing और Database
  // Transaction अभी जोड़ना बाकी है।
  return res.status(200).json({
    success: true,
    message: "Webhook signature verified"
  });
}

module.exports = {
  paymentWebhook,
  verifyWebhookSignature
};
