const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const mongoose = require("mongoose");
const Product = require("./models/Product");
const connectDB = require("./config/db");

const seedProducts = [
  {
    name: "Premium Wireless Headphones",
    price: 24999,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    description: "High-quality noise-canceling headphones, fashionably displayed.",
    category: "Electronics",
  },
  {
    name: "Modern Smartwatch",
    price: 15999,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
    description: "A sleek smartwatch, part of our premium tech-wear collection.",
    category: "Electronics",
  },
  {
    name: "Bluetooth Speaker",
    price: 7999,
    image: "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=800",
    description: "Compact speaker with rich sound and minimalist design.",
    category: "Audio",
  },
  {
    name: "Gaming Mouse",
    price: 5499,
    image: "https://images.unsplash.com/photo-1527698266440-12104e498b76?w=800",
    description: "Ergonomic gaming mouse for the professional setup.",
    category: "Electronics",
  },
  // 👉 Fashion Items on Mannequins
  {
    name: "Premium Leather Jacket",
    price: 12999,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
    description: "Authentic black leather jacket displayed on a professional mannequin.",
    category: "Men's Fashion",
  },
  {
    name: "Slim Fit Denim Jeans",
    price: 3499,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800",
    description: "Classic dark blue slim-fit denim, mannequin display.",
    category: "Men's Fashion",
  },
  {
    name: "Cotton Crew Neck T-Shirt",
    price: 999,
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?w=800",
    description: "Soft and breathable 100% cotton t-shirt, mannequin fit.",
    category: "Men's Fashion",
  },
  {
    name: "Formal White Shirt",
    price: 2499,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
    description: "Crisp white button-down shirt for a sharp mannequin look.",
    category: "Men's Fashion",
  },
  {
    name: "Casual Bomber Jacket",
    price: 5999,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800",
    description: "Versatile olive green bomber on display.",
    category: "Men's Fashion",
  },
  {
    name: "Chino Trousers",
    price: 2799,
    image: "https://images.unsplash.com/photo-1594932224012-c59d04584999?w=800",
    description: "Smart-casual beige chinos, mannequin display style.",
    category: "Men's Fashion",
  },
  {
    name: "Knitted Sweater",
    price: 3999,
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800",
    description: "Warm grey knitted sweater, catalog fit.",
    category: "Men's Fashion",
  },
  {
    name: "Chelsea Boots",
    price: 8999,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800",
    description: "Stylish brown suede Chelsea boots.",
    category: "Men's Fashion",
  },
  {
    name: "Canvas Sneakers",
    price: 4499,
    image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=800",
    description: "Minimalist white canvas sneakers.",
    category: "Men's Fashion",
  },
  {
    name: "Premium Wool Coat",
    price: 15999,
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800",
    description: "Luxurious charcoal wool overcoat on mannequin.",
    category: "Men's Fashion",
  },
];


const seedDB = async () => {
  try {
    await connectDB();
    await Product.deleteMany({});
    await Product.insertMany(seedProducts);
    console.log("✅ Database Seeded Successfully with 10 New Men's Fashion Items!");
  } catch (error) {
    console.error("❌ Seeding Error:", error.message);
  } finally {
    mongoose.connection.close();
    process.exit();
  }
};

seedDB();

