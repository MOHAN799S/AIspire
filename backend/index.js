const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI;
const client_url = process.env.CLIENT_URL;


app.use(cors({
  origin: client_url, // Only allow this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true               // If you're using cookies or auth headers
}));


mongoose.connect(mongoURI)
  .then(() => {
    app.get('/', (req, res) => {
  res.send('Hello World! This is the backend server.');
});

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
    console.log('✅ Connected to MongoDB');
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));


