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
  'Vitals Microservice': 'http://localhost:3002',
  'Add Vitals Microservice' : 'http://localhost:3002',
  'Edit Vitals Microservice': 'http://localhost:3002',
  'User Authentication Microservice': 'http://localhost:3003',
  'User Registration Microservice' : 'http://localhost:3003',
  'User Logoff Microservice': 'http://localhost:3003',
  'Motivational Tip Microservice': 'http://localhost:3004',
  'Add Motivational Tip Microservice': 'http://localhost:3004',
  'Delete Motivational Tip Microservice': 'http://localhost:3004',
  'Patient Vitals Microservice': 'http://localhost:3005',
  'Add Patient Vitals Microservice': 'http://localhost:3005',
  'Emergency Microservice': 'http://localhost:3005',
  'Add Emergency Microservice': 'http://localhost:3005'
};

app.get('/vitals', async (req, res) => {
  try {
    const response = await axios.get(`${serviceEndpoints['Vitals Microservice']}/vitals`);
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching vitals:', error);
    res.status(500).send('Internal Server Error');
  }
});
app.post('/vitals/add', async (req, res) => {
  try {
    const response = await axios.post(`${serviceEndpoints['Add Vitals Microservice']}/vitals/add`);
    res.send(response.data);
  } catch (error) {
    console.error('Error adding vitals: ', error);
    res.status(500).send('Internal Server Error');
  }
});

app.put('/vitals/:id', async (req, res) => {
  try{
    const response = await axios.put(`${serviceEndPoints['Edit Vitals Microservice']}/vitals/:id`);
    res.send(response.data);
  } catch (error) {
    console.error('Error updating vitals: ', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/tips', async (req, res) => {
  try{
    const response = await axios.get(`${serviceEndpoints['Motivational Tip Microservice']}/tips`);
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching tips: ', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/tips/add', async (req, res) => {
  try{
    const response = await axios.put(`${serviceEndpoints['Add Motivational Tip Microservice']}/tips/add`);
    res.send(response.data);
  } catch (error) {
    console.error('Error adding tips: ', error);
    res.status(500).send('Internal Server Error');
  }
});
app.delete('/tips/delete', async (req, res) => {
  try{
    const response = await axios.delete(`${serviceEndpoints['Delete Motivational Tip Microservice']}/tips/delete/:id`)
    res.send(response.data);
  } catch (error) {
    console.error('Error adding tips: ', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/patient', async (req, res) => {
  try {
    const response = await axios.get(`${serviceEndpoints['Patient Vitals Microservice']}/patient`);
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).send('Internal Server Error');
  }
});
app.post('/patient/add', async (req, res) => {
  try {
    const response = await axios.post(`${serviceEndpoints['Add Patient Vitals Microservice']}/patient/add`);
    res.send(response.data);
  } catch (error) {
    console.error('Error adding patient: ', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/emergency', async (req, res) => {
  try {
    const response = await axios.get(`${serviceEndpoints['Emergency Microservice']}/emergency`);
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching emergency:', error);
    res.status(500).send('Internal Server Error');
  }
});
app.post('/emergency/add', async (req, res) => {
  try {
    const response = await axios.post(`${serviceEndpoints['Add Emergency Microservice']}/emergency/add`);
    res.send(response.data);
  } catch (error) {
    console.error('Error adding emergency: ', error);
    res.status(500).send('Internal Server Error');
  }
});

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
    res.status(500).send('Internal Server Error');
  }
});

app.post('/auth/logout', async (req, res) => {
  try {
    const response = await axios.post(`${serviceEndPoints['User Logoff Microservice']}/auth/logoff`);
    res.send(response.data);
  } catch (error) {
    console.error('Error Logging Off: ', error);
    res.status.send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`API Gateway listening on port ${port}`);
});
