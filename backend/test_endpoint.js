const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config({ path: 'd:\\TimeBank\\backend\\.env' });

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB!");
        const Application = require('./models/Application');
        // Find the most recently accepted application
        const app = await Application.findOne({ status: 'accepted' }).sort({ updatedAt: -1 }).lean();
        console.log("LATEST ACCEPTED APP:");
        console.log(JSON.stringify(app, null, 2));
        mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err.message);
        process.exit(1);
    }
}
run();
