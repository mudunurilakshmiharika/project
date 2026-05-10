require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
    const uri = process.env.MONGO_URI;
    console.log("🔍 Checking connection to:", uri.replace(/:([^@]+)@/, ":****@"));
    
    try {
        console.log("🚀 Attempting to connect...");
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
        console.log("✅ SUCCESS: Connected to MongoDB Atlas!");
        process.exit(0);
    } catch (err) {
        console.error("❌ CONNECTION FAILED!");
        console.error("Error Message:", err.message);
        console.error("Error Code:", err.code);
        
        if (err.message.includes("Could not connect to any servers")) {
            console.log("\nPossible Causes:");
            console.log("1. Your current IP is not whitelisted in MongoDB Atlas.");
            console.log("2. Your local network/ISP is blocking port 27017.");
            console.log("3. The shard hostname in .env is outdated or incorrect.");
        }
        process.exit(1);
    }
};

testConnection();
