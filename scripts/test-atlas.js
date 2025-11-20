// scripts/test-atlas.js
// Simple connectivity test to MongoDB Atlas using the MONGO_URI in .env

require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME || 'bec-courses';

if (!uri) {
    console.error('ERROR: MONGO_URI is not set in .env');
    process.exit(2);
}

const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000, // 10s
});

async function run() {
    console.log('Attempting to connect to MongoDB Atlas...');
    try {
        await client.connect();
        const db = client.db(dbName);
        // Run a simple ping command
        const res = await db.command({ ping: 1 });
        console.log('✅ Connected to MongoDB Atlas');
        console.log('Ping response:', res);
        // List collections as an extra check (catch errors if none)
        try {
            const cols = await db.listCollections().toArray();
            console.log('Collections:', cols.map(c => c.name));
        } catch (err) {
            console.warn('Could not list collections:', err.message);
        }
        await client.close();
        process.exit(0);
    } catch (err) {
        console.error('\n✗ Connection failed');
        console.error('Error message:', err.message);
        if (err.stack) console.error(err.stack);
        // Some MongoClient errors include a reason or topology information
        if (err.reason) console.error('Reason:', err.reason);
        process.exit(1);
    }
}

run();
