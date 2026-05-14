require('dotenv').config();

const { MongoClient } = require('mongodb');
const dns = require('dns');

// Use Google DNS
dns.setServers(['8.8.8.8']);

// MongoDB URI from .env file
const uri = process.env.MONGO_URI;

// Create MongoDB client
const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000,
});

async function run() {
  console.log("🔍 [DEBUG] Starting Deep Diagnostic...\n");

  try {
    // Monitor server events
    client.on('serverDescriptionChanged', (event) => {
      console.log(
        `📡 [SERVER] ${event.address} state: ${event.newDescription.type}`
      );
    });

    console.log("🚀 [DEBUG] Attempting connection...\n");

    // Connect to MongoDB
    await client.connect();

    console.log("✅ SUCCESS: Database connection successful!");

    // Ping database
    await client.db("admin").command({ ping: 1 });

    console.log("🏓 Ping successful!");
    console.log("🎉 MongoDB is working correctly.\n");

    process.exit(0);

  } catch (err) {

    console.error("\n❌ DIAGNOSTIC FAILURE:");
    console.error("--------------------------------------------------");
    console.error("Name    :", err.name);
    console.error("Message :", err.message);

    if (err.reason) {
      console.error("Reason  :", err.reason.message || err.reason);
    }

    console.error("--------------------------------------------------");

    // Common error fixes
    if (err.message.includes("ETIMEOUT")) {
      console.log("\n👉 FIX:");
      console.log("Your system cannot reach MongoDB servers.");
      console.log("Possible DNS or internet issue.");
    }

    else if (
      err.message.includes("ECONNRESET") ||
      err.message.includes("Could not connect")
    ) {
      console.log("\n👉 FIX:");
      console.log("MongoDB Atlas may be blocking your IP.");
      console.log("Go to MongoDB Atlas → Network Access");
      console.log("Add your current IP or allow 0.0.0.0/0 temporarily.");
    }

    else if (
      err.message.includes("Authentication failed")
    ) {
      console.log("\n👉 FIX:");
      console.log("Username or password is incorrect.");
      console.log("Reset password in MongoDB Atlas.");
    }

    process.exit(1);

  } finally {

    // Close connection safely
    await client.close();
    console.log("\n🔒 Connection closed.");

  }
}

// Run function
run();