const express = require('express');
const app = express();

app.get('/test', (req, res) => {
    res.json('Test is ok');
});

app.listen(4000, () => {
  console.log('🚀 Server running at http://localhost:4000');
});
