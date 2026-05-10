const mongoose = require('mongoose');
const dns = require('dns').promises;

const runTest = async () => {
    // Correct Password from your latest update
    let uri = "mongodb://mudunuriharika3_db_user:hari2042@ac-cecc9oi-shard-00-00.py12aly.mongodb.net:27017,ac-cecc9oi-shard-00-01.py12aly.mongodb.net:27017,ac-cecc9oi-shard-00-02.py12aly.mongodb.net:27017/?ssl=true&replicaSet=atlas-o8muiv-shard-0&authSource=admin&appName=EIV5";

    console.log("🔍 [TEST] Resolving DNS...");
    dns.setServers(['8.8.8.8']);
    const srvHostname = "eiv5.2pksqqm.mongodb.net";
    
    try {
        const records = await dns.resolveSrv(`_mongodb._tcp.${srvHostname}`);
        const shards = records.map(r => `${r.name}:27017`).join(",");
        const finalUri = `mongodb://lakshmimudunuri53_db_user:Hari123@${shards}/test?ssl=true&authSource=admin`;
        
        console.log("✅ [TEST] DNS Resolved. Shards:", shards);
        console.log("🚀 [TEST] Attempting connection to shards directly...");
        
        await mongoose.connect(finalUri, { serverSelectionTimeoutMS: 5000 });
        console.log("✅ SUCCESS: Connected to MongoDB successfully!");
        process.exit(0);
    } catch (err) {
        console.error("❌ FAILURE:", err.message);
        process.exit(1);
    }
};

runTest();
