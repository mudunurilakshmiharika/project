const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  userEmail: String,
  items: Array,
  products: Array,
  totalAmount: Number,
  amount: Number,
  shippingAddress: {
    name: String,
    address: String,
    city: String,
    pincode: String,
  },
  paymentMethod: String,
  paymentStatus: { type: String, default: "Pending" },
  paymentId: String,
  orderId: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
