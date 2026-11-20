// SS ENGINE - PAYMENT ROUTES

const express = require("express");
const router = express.Router();

const {
  getPlans,
  createPayment
} = require("./payment-controller");

router.get("/plans", getPlans);

router.post("/create", createPayment);

module.exports = router;
