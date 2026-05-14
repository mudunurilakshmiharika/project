const { MongoClient } = require('mongodb');
require('dns').setServers(['8.8.8.8']);

// The exact string you provided with the password Hari123
const uri = "mongodb://mudunuriharika3_db_user:hari2042@ac-cecc9oi-shard-00-00.py12aly.mongodb.net:27017/test?authSource=admin&directConnection=true&tls=true";

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000,
});

async function run() {
  console.log("🔍 [DEBUG] Starting Deep Diagnostic...");
  
  try {
    // Monitor events
    client.on('serverDescriptionChanged', (event) => {
        console.log(`📡 [SERVER] ${event.address} state: ${event.newDescription.type}`);
    });

    console.log("🚀 [DEBUG] Attempting connection...");
    await client.connect();
    
    console.log("✅ SUCCESS: The database is reachable and the password is correct!");
    await client.db("admin").command({ ping: 1 });
    console.log("🏓 Ping successful!");
    
    process.exit(0);
  } catch (err) {
    console.error("\n❌ DIAGNOSTIC FAILURE:");
    console.error("   - Name:", err.name);
    console.error("   - Message:", err.message);
    console.error("   - Reason:", err.reason?.message || "N/A");
    
    if (err.message.includes("ETIMEOUT")) {
        console.log("\n👉 Fix: Your computer cannot find the server. (DNS Issue)");
    } else if (err.message.includes("ECONNRESET") || err.message.includes("Could not connect")) {
        console.log("\n👉 Fix: The server is rejecting your connection. (Whitelist or ISP Firewall Issue)");
    }
    
    process.exit(1);
  } finally {
    await client.close();
  }
}

run();
