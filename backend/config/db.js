const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("🚀 Connecting to MongoDB Atlas...");

    // 🛡️ SELF-HEALING: Use the most robust connection string possible
    const uri = process.env.MONGO_URI;

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000,
      retryWrites: true,
      family: 4, // 🛡️ Force IPv4 to avoid common Windows/VPN connectivity issues
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    console.log("\n⚠️  [DIAGNOSTIC] ACTION REQUIRED:");
    console.log("1. Your current Public IP (VPN) is likely: 149.50.211.158");
    console.log("2. Go to MongoDB Atlas -> Network Access");
    console.log("3. Add '149.50.211.158' to your whitelist, OR add '0.0.0.0/0' to allow access from anywhere.");
    console.log("4. If you are using ProtonVPN, try disconnecting it to see if the connection stabilizes.\n");
    process.exit(1);
  }
};

module.exports = connectDB;