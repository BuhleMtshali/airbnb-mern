const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors({
  credentials: true,
  origin: ['http://localhost:5173', 'http://localhost:5174'],
}));

app.get('/test', (req, res) => {
    res.json('Test is ok');
});

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  res.json({ name, email, password })
})

app.listen(4000, () => {
  console.log('🚀 Server running at http://localhost:4000');
});
