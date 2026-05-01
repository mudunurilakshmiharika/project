const mongoose = require("mongoose");
const dns = require("dns");

// Set DNS servers to resolve MongoDB Atlas SRV records
dns.setServers(["8.8.8.8"]);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected successfully to Atlas");
  } catch (error) {
    if (error.message.includes("bad auth")) {
      console.error("❌ MongoDB Auth Error: The username or password in your .env file is incorrect.");
      console.error("   Please check your Database User credentials in MongoDB Atlas.");
    } else {
      console.error("❌ MongoDB Connection Error:", error.message);
    }
    process.exit(1);
  }
};

module.exports = connectDB;