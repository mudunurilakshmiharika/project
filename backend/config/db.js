const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("🚀 Connecting to MongoDB Atlas...");

    // 🛡️ SELF-HEALING: Use the most robust connection string possible
    const uri = (process.env.MONGO_URI && process.env.MONGO_URI.includes('directConnection=true'))
      ? "mongodb+srv://mudunuriharika3_db_user:hari2042@py12aly.mongodb.net/test?retryWrites=true&w=majority"
      : process.env.MONGO_URI;

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000,
      retryWrites: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    console.log("👉 Tip: If this fails, your local network is blocking the connection.");
    process.exit(1);
  }
};

module.exports = connectDB;