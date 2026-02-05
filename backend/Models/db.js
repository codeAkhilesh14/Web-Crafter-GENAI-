const mongoose = require('mongoose');
const mongo_url = process.env.MONGODB_URL;

mongoose.connect(mongo_url)
  .then(() => {
    console.log('✅ MongoDB Connected...');
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
  });
