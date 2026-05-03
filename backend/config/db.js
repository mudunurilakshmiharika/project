const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    
    if (error.message.includes("ETIMEOUT")) {
      console.error("👉 Tip: This is a DNS timeout. Try checking your internet connection.");
    } else if (error.message.includes("whitelist") || error.message.includes("IP") || error.message.includes("Could not connect to any servers")) {
      console.error("👉 Tip: Your IP might not be whitelisted in MongoDB Atlas.");
      console.error("   1. Go to MongoDB Atlas -> Network Access.");
      console.error("   2. Add your current IP address (or 0.0.0.0/0 for access from anywhere).");
      console.error("   3. Your current Public IP is likely: 212.8.250.238");
    } else if (error.message.includes("querySrv")) {
      console.error("👉 Tip: SRV resolution failed. Your network might be blocking SRV lookups.");
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;