const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/User.js');
const Place = require('./models/Place.js');
const Booking = require('./models/Booking.js');
require('dotenv').config();

const app = express();
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'fasefraw4r53wq45wdfgw';

// DB connect
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(express.json());
app.use(cors({
  credentials: true,
  origin: ['http://localhost:5173', 'http://localhost:5174'],
}));

// 🧠 Get user data from token
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

// ✅ Create Booking
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
    console.error('❌ Booking creation failed:', err);
    res.status(500).json({ error: 'Booking creation failed', details: err.message });
  }
});

// ✅ Get Bookings
app.get('/bookings', async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const bookings = await Booking.find({ user: userData.id }).populate('place');
    res.json(bookings);
  } catch (err) {
    console.error('❌ Failed to get bookings:', err);
    res.status(500).json({ error: 'Failed to get bookings' });
  }
});

// ✅ Create Place
app.post('/places', async (req, res) => {
  const { token } = req.cookies;
  const {
    title, address, addedPhotos, description,
    perks, extraInfo, checkIn, checkOut, maxGuests, price
  } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;

    const placeDoc = await Place.create({
      owner: userData.id,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    });

    res.json(placeDoc);
  });
});

// ✅ Update Place
app.put('/places', async (req, res) => {
  const { token } = req.cookies;
  const {
    id, title, address, addedPhotos, description,
    perks, extraInfo, checkIn, checkOut, maxGuests, price
  } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title, address, photos: addedPhotos, description,
        perks, extraInfo, checkIn, checkOut, maxGuests, price
      });
      await placeDoc.save();
      res.json('ok');
    }
  });
});

// ✅ Get All Places
app.get('/places', async (req, res) => {
  res.json(await Place.find());
});

// ✅ Get User's Places
app.get('/user-places', (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const { id } = userData;
    res.json(await Place.find({ owner: id }));
  });
});

// ✅ Get Place by ID
app.get('/places/:id', async (req, res) => {
  const { id } = req.params;
  res.json(await Place.findById(id));
});

// ✅ Test route
app.get('/test', (req, res) => {
  res.json('Test is ok');
});

// ✅ Register
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

// ✅ Login
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

// ✅ Profile
app.get('/profile', (req, res) => {
  const { token } = req.cookies;

  if (!token) return res.json(null);

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.status(401).json('Token invalid');
    const userDoc = await User.findById(userData.id);
    res.json(userDoc);
  });
});

// ✅ Logout
app.post('/logout', (req, res) => {
  res.cookie('token', '').json(true);
});

// ✅ Upload by link
app.post('/upload-by-link', async (req, res) => {
  const { link } = req.body;
  if (!link) return res.status(400).json({ error: 'No link provided' });

  const newName = 'photo' + Date.now() + '.jpg';
  try {
    await imageDownloader.image({
      url: link,
      dest: __dirname + '/uploads/' + newName,
    });
    res.json(newName);
  } catch (err) {
    console.error("❌ Image download failed:", err);
    res.status(500).json({ error: 'Image download failed', details: err.message || err });
  }
});

// ✅ Upload via form
const photosMiddleware = multer({ dest: 'uploads/' });
app.post('/upload', photosMiddleware.array('photos', 100), async (req, res) => {
  try {
    const uploadFiles = [];
    for (let i = 0; i < req.files.length; i++) {
      const { path, originalname } = req.files[i];
      const parts = originalname.split('.');
      const ext = parts[parts.length - 1];
      const newPath = path + '.' + ext;
      fs.renameSync(path, newPath);
      uploadFiles.push(newPath.replace('uploads/', ''));
    }
    res.json(uploadFiles);
  } catch (err) {
    console.error('❌ File upload error:', err);
    res.status(500).json({ error: 'File upload failed' });
  }
});

// ✅ Start Server
app.listen(4000, () => {
  console.log('🚀 Server running at http://localhost:4000');
});
