const mongoose = require('mongoose');

const testReplicaSet = async () => {
    // URI from test-db.js line 6
    const uri = "mongodb://mudunuriharika3_db_user:hari2042@ac-cecc9oi-shard-00-00.py12aly.mongodb.net:27017,ac-cecc9oi-shard-00-01.py12aly.mongodb.net:27017,ac-cecc9oi-shard-00-02.py12aly.mongodb.net:27017/?ssl=true&replicaSet=atlas-o8muiv-shard-0&authSource=admin&appName=EIV5";
    
    console.log("🚀 Testing Connection with ReplicaSet...");
    try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
        console.log("✅ SUCCESS: Connected with ReplicaSet!");
        process.exit(0);
    } catch (err) {
        console.error("❌ FAILED:", err.message);
        process.exit(1);
    }
};

testReplicaSet();
