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
const { resolve } = require('path');
const { rejects } = require('assert');
require('dotenv').config();

const app = express();
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'fasefraw4r53wq45wdfgw';

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.use(cookieParser());
app.use('/uploads', express.static(__dirname+'/uploads'));
app.use(express.json());
app.use(cors({
  credentials: true,
  origin: ['http://localhost:5173', 'http://localhost:5174'],
}));

function getUserDataFromReq(req){
  return new Promise((resolve, reject) => {
    jwt.verify(req.cook.token, jwtSecret, {}, async (err, userData) => {
      resolve(userData);
    })
  })
}

app.post('/bookings', async(req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  const { place, checkIn, checkOut, numberOfGuests, name, phone, price } = req.body;
  Booking.create({ place, checkIn, checkOut, numberOfGuests, name, phone, price, user: userData.id}).then((doc) => {
    res.json(doc);
  }).catch((err) => {
    throw err;
  })
});

app.get('/bookings', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  res.json(await Booking.find({ user: userData.id }).populate('place'))
})

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
      photos: addedPhotos, // 🟢 make sure this is correctly mapped
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

app.get('/places', async(req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json(await Place.find())
})


app.get('/user-places', (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const { id } = userData;
    res.json(await Place.find({ owner: id }))
  })
})

app.get('/places/:id', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  res.json(await Place.findById(id))
})

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

app.put('/places', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  const { id, title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price } = req.body;
  jwt.verify(token, jwtSecret, {}, async(err, userData) => {
    if(err) throw err;
    const placeDoc = await Place.findById(id);
    if(userData.id === placeDoc.owner.toString()){
      placeDoc.set({ title, address, photos: addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price })
      await placeDoc.save();
      res.json('ok')
    }
  })
})

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
});


app.post('/upload-by-link', async (req, res) => {
  const { link } = req.body;
  if (!link) {
    return res.status(400).json({ error: 'No link provided' });
  }

  const newName = 'photo' + Date.now() + '.jpg';
  console.log("🟡 Attempting to download:", link);
  try {
    await imageDownloader.image({
      url: link,
      dest: __dirname + '/uploads/' + newName,
    });
    console.log("✅ Successfully downloaded:", newName);
    res.json(newName);
  } catch (err) {
    console.error("❌ Image download failed:", err);  // Log the entire error object
    res.status(500).json({ error: 'Image download failed', details: err.message || err });
  }
});


const photosMiddleware = multer({dest: 'uploads/'});
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



app.listen(4000, () => {
  console.log('🚀 Server running at http://localhost:4000');
});
