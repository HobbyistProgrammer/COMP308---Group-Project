// microservice-auth.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3003;

app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from this origin
  credentials: true // Allow sending cookies in CORS requests
}));

app.post('/auth/login', (req, res) => {
  res.send('User authenticated');
});

app.post('/auth/signup', (req, res) => {
  console.log('Signed Up');
  res.send('Signed Up');
});

app.listen(port, () => {
  console.log(`User Authentication Microservice listening on port ${port}`);
});
