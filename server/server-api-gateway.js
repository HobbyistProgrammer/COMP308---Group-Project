//server-api-gateway.js
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

const cors = require('cors')
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
  });
app.use(cors());
//
const serviceEndpoints = {
  'Product Microservice': 'http://localhost:3002',
  'User Authentication Microservice': 'http://localhost:3003',
  'User Registration Microservice' : 'http://localhost:3003',
};
//
app.get('/products', async (req, res) => {
  try {
    const response = await axios.get(`${serviceEndpoints['Product Microservice']}/products`);
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Internal Server Error');
  }
});
//
app.post('/auth/login', async (req, res) => {
  try {
    const response = await axios.post(`${serviceEndpoints['User Authentication Microservice']}/auth/login`);
    res.send(response.data);
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/auth/signup', async (req, res) => {
  try{
    const response = await axios.post(`${serviceEndpoints['User Registration Microservice']}/auth/signup`);
    res.send(response.data);
  } catch (error) {
    console.error('Error registering user: ', error);
    res.status(500). send('Internal Server Error');
  }
})

app.listen(port, () => {
  console.log(`API Gateway listening on port ${port}`);
});
