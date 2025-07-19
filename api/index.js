const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const User = require('./models/User.js');
const Place = require('./models/Place.js');
const Booking = require('./models/Booking.js');

const app = express();
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret';
const photosMiddleware = multer({ dest: 'uploads/' });

const PORT = process.env.PORT || 4000;

// === MongoDB Connection ===
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// === Middleware ===
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// ✅ CORS with multiple origins (for dev & prod)
app.use(cors({
  credentials: true,
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://deft-crisp-e20b4b.netlify.app'
  ]
}));

// === Helper: Get user from JWT ===
function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, (err, userData) => {
      if (err) reject(err);
      resolve(userData);
    });
  });
}

// === Auth Routes ===
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
  if (!userDoc) return res.status(404).json('User not found');

  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (!passOk) return res.status(422).json('Invalid password');

  jwt.sign({ id: userDoc._id, email: userDoc.email }, jwtSecret, {}, (err, token) => {
    if (err) throw err;
    res.cookie('token', token).json(userDoc);
  });
});

app.get('/profile', async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.json(null);
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.status(401).json('Token invalid');
    const userDoc = await User.findById(userData.id);
    res.json({ name: userDoc.name, email: userDoc.email, _id: userDoc._id });
  });
});

app.post('/logout', (req, res) => {
  res.cookie('token', '').json(true);
});

// === Place Routes ===
app.post('/places', async (req, res) => {
  const { token } = req.cookies;
  const { title, address, addedPhotos, description, price, perks, extraInfo, checkIn, checkOut, maxGuests } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner: userData.id,
      title, address, photos: addedPhotos, description,
      price, perks, extraInfo, checkIn, checkOut, maxGuests
    });
    res.json(placeDoc);
  });
});

app.put('/places', async (req, res) => {
  const { token } = req.cookies;
  const { id, title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({ title, address, photos: addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price });
      await placeDoc.save();
      res.json('ok');
    } else {
      res.status(403).json('Unauthorized');
    }
  });
});

app.get('/places', async (req, res) => {
  res.json(await Place.find());
});

app.get('/places/:id', async (req, res) => {
  const { id } = req.params;
  res.json(await Place.findById(id));
});

app.get('/user-places', async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
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
    if (placeDoc.owner.toString() === userData.id) {
      await Place.findByIdAndDelete(id);
      res.json('Deleted successfully');
    } else {
      res.status(403).json('Forbidden');
    }
  });
});

// === Image Uploads ===
app.post('/upload-by-link', async (req, res) => {
  const { link } = req.body;
  const newName = 'photo' + Date.now() + '.jpg';
  await imageDownloader.image({ url: link, dest: path.join(__dirname, 'uploads', newName) });
  res.json(newName);
});

app.post('/upload', photosMiddleware.array('photos', 100), async (req, res) => {
  const uploadedFiles = [];
  for (const file of req.files) {
    const ext = path.extname(file.originalname);
    const newPath = file.path + ext;
    fs.renameSync(file.path, newPath);
    uploadedFiles.push(path.basename(newPath));
  }
  res.json(uploadedFiles);
});

// === Bookings ===
app.post('/bookings', async (req, res) => {
  const userData = await getUserDataFromReq(req);
  const { place, checkIn, checkOut, numberOfGuests, name, phone, price } = req.body;
  const bookingDoc = await Booking.create({ place, checkIn, checkOut, numberOfGuests, name, phone, price, user: userData.id });
  res.json(bookingDoc);
});

app.get('/bookings', async (req, res) => {
  const userData = await getUserDataFromReq(req);
  const bookings = await Booking.find({ user: userData.id }).populate('place');
  res.json(bookings);
});

app.delete('/bookings/:id', async (req, res) => {
  const userData = await getUserDataFromReq(req);
  const { id } = req.params;
  const booking = await Booking.findById(id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  if (booking.user.toString() !== userData.id) {
    return res.status(403).json({ error: 'Not authorized to cancel this booking' });
  }
  await Booking.findByIdAndDelete(id);
  res.json({ message: 'Booking cancelled successfully' });
});

// === Start Server ===
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
