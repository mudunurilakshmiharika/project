const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/Order");
const sendEmail = require("../utils/sendEmail");

// PLACE ORDER & NOTIFY ADMIN
router.post("/", async (req, res) => {
  console.log("========================================");
  console.log("🚨 NEW ORDER RECEIVED AT BACKEND! 🚨");
  console.log("========================================");
  try {
    const { items, totalAmount, shippingAddress, paymentMethod, userId, userEmail, paymentId } = req.body;
    
    console.log("New Order Request:", { paymentMethod, totalAmount, userId, userEmail });

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Ensure userId is a valid ObjectId or null
    const validUserId = mongoose.Types.ObjectId.isValid(userId) ? userId : null;

    const order = new Order({
      user: validUserId,
      userEmail: userEmail || "Not Provided",
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentId: paymentId || "N/A",
      paymentStatus: paymentMethod === "Cash on Delivery" ? "Pending" : "Paid",
    });

    const savedOrder = await order.save();
    console.log("Order saved to DB:", savedOrder._id);

    // 📧 SEND EMAIL TO ADMIN & CUSTOMER
    try {
      const adminEmail = process.env.ADMIN_EMAIL || "lakshmimudunuri53@gmail.com";
      const subject = `Order Confirmed: ${savedOrder._id} - LuxeStore`;
      
      console.log("Preparing email for shipping address:", shippingAddress);

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
          <h2 style="color: #121212; text-align: center;">LuxeStore</h2>
          <p>Hi ${shippingAddress.name || 'Customer'},</p>
          <p>Your order has been placed successfully!</p>
          <hr>
          <p><strong>Order ID:</strong> ${savedOrder._id}</p>
          <p><strong>Status:</strong> ${paymentMethod === "Cash on Delivery" ? "Processing (COD)" : "Paid"}</p>
          <p><strong>Payment ID:</strong> ${paymentId || "N/A"}</p>
          
          <h3>Order Details:</h3>
          <ul>
            ${items.map(i => `<li>${i.name} - ₹${i.price}</li>`).join("")}
          </ul>
          <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
          <hr>
          <p><strong>Shipping to:</strong> ${shippingAddress.address}, ${shippingAddress.city} - ${shippingAddress.pincode}</p>
          <hr>
          <p style="font-size: 0.8rem; color: #888; text-align: center;">Thank you for shopping with LuxeStore!</p>
        </div>
      `;

      // Notify Admin
      console.log(`Sending notification to admin: ${adminEmail}`);
      sendEmail(adminEmail, `Admin: New Order ${savedOrder._id}`, emailHtml)
        .then(success => console.log("Admin email status:", success ? "SENT" : "FAILED"))
        .catch(err => console.error("Admin Email Error:", err));
      
      // Notify Customer
      if (userEmail && userEmail !== "Not Provided") {
        console.log(`Sending confirmation to customer: ${userEmail}`);
        sendEmail(userEmail, subject, emailHtml)
          .then(success => console.log("Customer email status:", success ? "SENT" : "FAILED"))
          .catch(err => console.error("Customer Email Error:", err));
      }
    } catch (emailErr) {
      console.error("Email setup error:", emailErr);
    }

    res.status(201).json({ 
      message: "Order placed successfully", 
      order: savedOrder 
    });

  } catch (error) {
    console.error("Order Creation Error Details:", error);
    res.status(500).json({ 
      message: "Error placing order", 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    });
  }
});

// GET ALL ORDERS (FOR ADMIN DASHBOARD)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

module.exports = router;
