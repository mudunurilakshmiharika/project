const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const sendEmail = require("../utils/sendEmail");

// PLACE ORDER & NOTIFY ADMIN
router.post("/", async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, paymentMethod, userId } = req.body;
    
    const order = new Order({
      user: userId,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === "Cash on Delivery" ? "Pending" : "Paid",
    });

    const savedOrder = await order.save();

    // 📧 SEND EMAIL TO ADMIN
    const adminEmail = "lakshmimudunuri53@gmail.com";
    const subject = `New Order Alert - ₹${totalAmount} from ${shippingAddress.name}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2563eb;">New Order Received!</h2>
        <p><strong>Order ID:</strong> ${savedOrder._id}</p>
        <hr>
        <h3>Customer Details:</h3>
        <p><strong>Name:</strong> ${shippingAddress.name}</p>
        <p><strong>Address:</strong> ${shippingAddress.address}</p>
        <p><strong>Location:</strong> ${shippingAddress.city} - ${shippingAddress.pincode}</p>
        
        <h3>Order Summary:</h3>
        <ul>
          ${items.map(i => `<li>${i.name} - ₹${i.price}</li>`).join("")}
        </ul>
        <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <hr>
        <p style="font-size: 0.8rem; color: #666;">This is an automated notification from LuxeStore Admin System.</p>
      </div>
    `;

    await sendEmail(adminEmail, subject, emailHtml);

    res.status(201).json({ 
      message: "Order placed & admin notified", 
      order: savedOrder 
    });

  } catch (error) {
    res.status(500).json({ message: "Error placing order", error: error.message });
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
