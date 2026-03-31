require('dotenv').config();
const mongoose = require('mongoose');
const Application = require('./models/Application');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(async () => {
  const apps = await Application.find().sort({createdAt:-1}).limit(5);
  console.log(JSON.stringify(apps, null, 2));
  process.exit(0);
})
.catch(err => {
  console.error(err);
  process.exit(1);
});
