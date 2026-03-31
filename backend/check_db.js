const { MongoClient } = require('mongodb');
require('dotenv').config();

async function main() {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/timebank";
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db(); 
        // Some connection strings have the DB name, but if not we specify 'TimeBank' or 'test'. 
        // We will just do client.db('test') or whatever we find. Usually uri has the DB name.
        const apps = await db.collection('applications').find({}).sort({_id: -1}).limit(3).toArray();
        console.log(JSON.stringify(apps, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
main();
