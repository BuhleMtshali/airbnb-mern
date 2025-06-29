const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Place = require('./models/Place');
const Booking = require('./models/Booking');

const app = express();
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = process.env.JWT_SECRET || 'supersecret123';

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(express.json());
app.use(cors({
  credentials: true,
  origin: ['http://localhost:5173', 'http://localhost:5174'], // adjust for frontend ports
}));

// 🔐 Utility: Extract user data from token
function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    const { token } = req.cookies;
    if (!token) return reject('No token provided');
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) return reject(err);
      resolve(userData);
    });
  });
}

// 📌 Authentication Routes
app.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
      role: role || 'user',
    });
    res.json(userDoc);
  } catch (err) {
    res.status(422).json({ error: 'Registration failed', details: err.message });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });

  if (!userDoc) return res.status(404).json('User not found');

  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (!passOk) return res.status(422).json('Invalid password');

  jwt.sign({ id: userDoc._id, email: userDoc.email, role: userDoc.role }, jwtSecret, {}, (err, token) => {
    if (err) throw err;
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    }).json({
      name: userDoc.name,
      email: userDoc.email,
      _id: userDoc._id,
      role: userDoc.role,
    });
  });
});

app.get('/profile', (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.json(null);

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.status(401).json('Token invalid');
    const userDoc = await User.findById(userData.id);
    res.json(userDoc);
  });
});

app.post('/logout', (req, res) => {
  res.cookie('token', '').json(true);
});

// 🏠 Places Routes
app.post('/places', async (req, res) => {
  const { token } = req.cookies;
  const data = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.status(401).json('Unauthorized');
    const placeDoc = await Place.create({ ...data, owner: userData.id });
    res.json(placeDoc);
  });
});

app.put('/places', async (req, res) => {
  const { token } = req.cookies;
  const { id, ...updateData } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.status(401).json('Unauthorized');
    const placeDoc = await Place.findById(id);
    if (placeDoc.owner.toString() !== userData.id) return res.status(403).json('Forbidden');
    placeDoc.set(updateData);
    await placeDoc.save();
    res.json('ok');
  });
});

app.get('/places', async (req, res) => {
  const places = await Place.find();
  res.json(places);
});

app.get('/places/:id', async (req, res) => {
  const { id } = req.params;
  const place = await Place.findById(id);
  res.json(place);
});

app.get('/user-places', (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.status(401).json('Unauthorized');
    const places = await Place.find({ owner: userData.id });
    res.json(places);
  });
});

app.delete('/places/:id', async (req, res) => {
  const { id } = req.params;
  const { token } = req.cookies;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.status(401).json('Unauthorized');
    const placeDoc = await Place.findById(id);
    if (!placeDoc) return res.status(404).json('Place not found');
    if (placeDoc.owner.toString() !== userData.id) return res.status(403).json('Forbidden');
    await Place.findByIdAndDelete(id);
    res.json('Deleted successfully');
  });
});

// 📦 Booking Routes
app.post('/bookings', async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const { place, checkIn, checkOut, numberOfGuests, name, phone, price } = req.body;

    const bookingDoc = await Booking.create({
      place,
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      phone,
      price,
      user: userData.id,
    });

    res.json(bookingDoc);
  } catch (err) {
    res.status(500).json({ error: 'Booking creation failed', details: err.message });
  }
});

app.get('/bookings', async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const bookings = await Booking.find({ user: userData.id }).populate('place');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get bookings' });
  }
});

// 🖼️ Image Uploads
app.post('/upload-by-link', async (req, res) => {
  const { link } = req.body;
  if (!link) return res.status(400).json({ error: 'No link provided' });

  const newName = 'photo' + Date.now() + '.jpg';
  try {
    await imageDownloader.image({ url: link, dest: __dirname + '/uploads/' + newName });
    res.json(newName);
  } catch (err) {
    res.status(500).json({ error: 'Image download failed', details: err.message });
  }
});

const photosMiddleware = multer({ dest: 'uploads/' });
app.post('/upload', photosMiddleware.array('photos', 100), async (req, res) => {
  try {
    const uploadFiles = req.files.map(file => {
      const ext = file.originalname.split('.').pop();
      const newPath = file.path + '.' + ext;
      fs.renameSync(file.path, newPath);
      return newPath.replace('uploads/', '');
    });
    res.json(uploadFiles);
  } catch (err) {
    res.status(500).json({ error: 'File upload failed' });
  }
});

// 🌐 Test endpoint
app.get('/test', (req, res) => {
  res.json('Test is OK');
});

// 🚀 Launch Server
app.listen(4000, () => {
  console.log('🚀 Server running at http://localhost:4000');
});
