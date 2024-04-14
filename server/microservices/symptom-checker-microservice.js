//symptom-checker-microservice
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3007; 

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));


app.use(express.json());

// Set up a POST route for checking symptoms
app.post('/check-symptoms', async (req, res) => {
    console.log('Received symptoms:', req.body);
  const { symptoms } = req.body; 

  const options = {
    method: 'POST',
    url: 'https://symptom-checker4.p.rapidapi.com/analyze',
    headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': 'ef6e1df0d5mshdc5feaf35f3f3fcp1b27b4jsn8f6e2975be5a',
        'X-RapidAPI-Host': 'symptom-checker4.p.rapidapi.com'
      },
    data: { symptoms }
  };

  try {
    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    console.error('Error calling the symptom checker API:', error);
    if (error.response) {
      // Log the detailed response from the third-party API
      console.error('Error response from symptom checker API:', error.response);
    }
    res.status(500).send('An error occurred while processing your request.');
  }
});

app.listen(port, () => {
  console.log(`Symptom Checker Microservice running on port ${port}`);
});
