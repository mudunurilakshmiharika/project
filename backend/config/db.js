const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("🚀 Connecting to MongoDB Atlas...");

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    console.log("👉 Tip: If this fails, your local network is blocking the connection.");
    process.exit(1);
  }
};

module.exports = connectDB;