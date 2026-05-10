require('dotenv').config();
const mongoose = require('mongoose');

const testUris = async () => {
    const baseUri = "mongodb://mudunuriharika3_db_user:hari2042@";
    const shards = "ac-cecc9oi-shard-00-00.py12aly.mongodb.net:27017,ac-cecc9oi-shard-00-01.py12aly.mongodb.net:27017,ac-cecc9oi-shard-00-02.py12aly.mongodb.net:27017";
    const suffix = "/?ssl=true&authSource=admin";
    
    const uris = [
        // 1. Current in .env (Single shard direct)
        process.env.MONGO_URI,
        // 2. All shards
        `${baseUri}${shards}${suffix}`,
        // 3. Try another password if you think it might be wrong (e.g. Hari123)
        `mongodb://mudunuriharika3_db_user:Hari123@ac-cecc9oi-shard-00-00.py12aly.mongodb.net:27017/?ssl=true&authSource=admin&directConnection=true`,
        // 4. Try the other user mentioned in logs
        `mongodb://lakshmimudunuri53_db_user:Hari123@ac-cecc9oi-shard-00-00.py12aly.mongodb.net:27017/?ssl=true&authSource=admin&directConnection=true`
    ];

    for (let i = 0; i < uris.length; i++) {
        console.log(`\n🧪 Testing URI #${i + 1}...`);
        try {
            await mongoose.connect(uris[i], { serverSelectionTimeoutMS: 5000 });
            console.log(`✅ SUCCESS with URI #${i + 1}!`);
            console.log("Found working URI:", uris[i].replace(/:([^@]+)@/, ":****@"));
            process.exit(0);
        } catch (err) {
            console.error(`❌ FAILED URI #${i + 1}:`, err.message);
        }
    }
    
    console.log("\n😰 All connection attempts failed.");
    process.exit(1);
};

testUris();
