const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User.js');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const bcryptSalt = bcrypt.genSaltSync(10);

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.use(express.json());
app.use(cors({
  credentials: true,
  origin: ['http://localhost:5173', 'http://localhost:5174'],
}));

app.get('/test', (req, res) => {
  res.json('Test is ok');
});

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }
});

app.listen(4000, () => {
  console.log('🚀 Server running at http://localhost:4000');
});

