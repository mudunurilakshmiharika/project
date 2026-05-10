const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ CREATE ORDER
router.post("/create-order", async (req, res) => {
  try {
    if (!req.body.amount || isNaN(req.body.amount)) {
      return res.status(400).json({ success: false, message: "Invalid amount provided" });
    }

    const options = {
      amount: Math.round(req.body.amount * 100), // Ensure it's an integer
      currency: "INR",
      receipt: "receipt_order_" + Date.now()
    };

    const order = await razorpay.orders.create(options);
    res.json(order);

  } catch (error) {
    console.error("Razorpay Order Error:", error);
    res.status(500).json({
      success: false,
      message: error.description || error.message || "Razorpay Order Creation Failed"
    });
  }
});

// ✅ VERIFY PAYMENT + SEND EMAIL
router.post("/verify", async (req, res) => {

  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      email,
      products,
      amount
    } = req.body;

    // ✅ Verify Signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({
        success: false,
        message: "Invalid signature"
      });
    }

    // ✅ SUCCESS RESPONSE
    res.json({
      success: true,
      message: "Payment verified successfully"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Order save failed"
    });
  }
});

module.exports = router;