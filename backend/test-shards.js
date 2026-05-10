const mongoose = require('mongoose');

const testShards = async () => {
    const shards = [
        "ac-sqyd14n-shard-00-00.2pksqqm.mongodb.net",
        "ac-sqyd14n-shard-00-01.2pksqqm.mongodb.net",
        "ac-sqyd14n-shard-00-02.2pksqqm.mongodb.net"
    ];

    for (const shard of shards) {
        const uri = `mongodb://lakshmimudunuri53_db_user:Hari123@${shard}:27017/test?ssl=true&authSource=admin&directConnection=true&tlsAllowInvalidCertificates=true`;
        console.log(`🚀 [TEST] Trying direct connection to Shard: ${shard}...`);
        
        try {
            await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
            console.log(`✅ SUCCESS: Connected to ${shard} successfully!`);
            process.exit(0);
        } catch (err) {
            console.error(`❌ FAILED ${shard}:`, err.message);
            // Continue to next shard
        }
    }
    console.log("😰 All shards failed direct connection.");
    process.exit(1);
};

testShards();
