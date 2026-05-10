const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String,
  category: String,
}, { bufferCommands: false });

module.exports = mongoose.model("Product", productSchema);