const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/User.js');
require('dotenv').config();

const app = express();
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'fasefraw4r53wq45wdfgw';

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.use(cookieParser());
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

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });

  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({ id: userDoc._id, email: userDoc.email }, jwtSecret, {}, (err, token) => {
        if (err) throw err;
        res.cookie('token', token).json(userDoc);
      });
    } else {
      res.status(422).json('Invalid password');
    }
  } else {
    res.status(404).json('User not found');
  }
});

app.get('/profile', (req, res) => {
  mongoose.connect(process.env.MONGO_URL)
  const { token } = req.cookies;

  if (!token) {
    return res.json(null);
  }

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.status(401).json('Token invalid');
    const userDoc = await User.findById(userData.id);
    res.json(userDoc);
  });
});

app.post('/logout', (req, res) => {
  res.cookie('token', '').json(true);
})

app.listen(4000, () => {
  console.log('🚀 Server running at http://localhost:4000');
});
