const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const transporter = require("../config/mailer");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Create Order
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100, // Amount in paise
      currency: "INR",
      receipt: "receipt_order",
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error("Order Creation Error:", err);
    res.status(500).send(err);
  }
});

// VERIFY + SAVE + EMAIL
router.post("/verify", async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    email,
    products,
    amount
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    try {
      // ✅ Save order in DB
      const newOrder = new Order({
        userEmail: email,
        products,
        amount,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id
      });

      await newOrder.save();

      // ✅ Send email
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Order Confirmation",
        html: `
          <h2>✅ Payment Successful</h2>
          <p>Thank you for your purchase!</p>
          <p><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
          <p><strong>Amount:</strong> ₹${amount}</p>
        `
      });

      res.json({ success: true });

    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Order save failed" });
    }
  } else {
    res.status(400).json({ success: false, message: "Invalid signature" });
  }
});

module.exports = router;