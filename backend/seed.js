require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");
const connectDB = require("./config/db");

const seedProducts = [
  {
    name: "Premium Wireless Headphones",
    price: 24999,
    image: "assets/images/headphones.png",
    description: "High-quality noise-canceling wireless headphones.",
    category: "Electronics",
  },
  {
    name: "Modern Smartwatch",
    price: 15999,
    image: "assets/images/watch.png",
    description: "A sleek smartwatch with all the features you need.",
    category: "Electronics",
  },

  {
    name: "Bluetooth Speaker",
    price: 7999,
    image: "assets/images/speaker.png",
    description: "Compact speaker with rich sound quality.",
    category: "Audio",
  },
  {
    name: "Gaming Mouse",
    price: 5499,
    image: "assets/images/mouse.png",
    description: "Ergonomic gaming mouse with customizable buttons.",
    category: "Electronics",
  },
];

const seedDB = async () => {
  await connectDB();
  await Product.deleteMany({});
  await Product.insertMany(seedProducts);
  console.log("Database Seeded!");
  process.exit();
};

seedDB();
