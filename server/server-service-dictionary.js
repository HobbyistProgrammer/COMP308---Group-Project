const express = require('express');
const app = express();
const port = 3001;

const serviceDictionary = {
  services: [
    {
      name: 'Vitals Microservice',
      endpoints: [
        {
          name: 'GetVitals',
          url: 'http://localhost:3002/vitals',
          method: 'GET',
        },
      ],
    },
    {
      name: 'Add Vitals Microservice',
      endpoints: [
        {
          name: 'AddVitals',
          url: 'http://localhost:3002/vitals/add',
          method: 'POST',
        },
      ],
    },
    {
      name: 'Edit Vitals Microservice',
      endpoints: [
        {
          name: 'EditVitals',
          url: 'http://localhost:3002/vitals/:id',
          method: 'PUT',
        },
      ],
    },
    {
      name: 'User Authentication Microservice',
      endpoints: [
        {
          name: 'Login',
          url: 'http://localhost:3003/auth/login',
          method: 'POST',
        },
      ],
    },
    {
      name: 'User Registration Microservice',
      endpoints: [
        {
          name: 'Register',
          url: 'http://localhost:3003/auth/signup',
          method: 'POST'
        },
      ],
    },
    {
      name: 'User Logoff Microservice',
      endpoints: [
        {
          name: 'Logout',
          url: 'http://localhost:3003/auth/logoff',
          method: 'POST'
        },
      ],
    },
    {
      name: 'Motivational Tip Microservice',
      endpoints: [
        {
          name: 'GetTips',
          url: 'http://localhost:3004/tips',
          method: 'GET'
        },
      ],
    },
    {
      name: 'Add Motivational Tip Microservice',
      endpoints: [
        {
          name: 'AddTips',
          url: 'http://localhost:3004/tips/add',
          method: 'POST'
        },
      ],
    },
    {
      name: 'Delete Motivational Tip Microservice',
      endpoints: [
        {
          name: 'DeleteTips',
          url: 'http://localhost:3004/tips/delete/:id',
          method: 'DELETE'
        },
      ],
    },
    {
      name: 'Patient Vitals Microservice',
      endpoints: [
        {
          name: 'GetPatientVitals',
          url: 'http://localhost:3005/patient',
          method: 'GET'
        },
      ],
    },
    {
      name: 'Add Patient Vitals Microservice',
      endpoints: [
        {
          name: 'AddPatientVitals',
          url: 'http://localhost:3005/patient/add',
          method: 'POST'
        },
      ],
    },
    {
      name: 'Emergency Microservice',
      endpoints: [
        {
          name: 'GetEmergency',
          url: 'http://localhost:3005/emergency',
          method: 'GET'
        },
      ],
    },
    {
      name: 'Add Emergency Microservice',
      endpoints: [
        {
          name: 'AddEmergency',
          url: 'http://localhost:3005/emergency/add',
          method: 'POST'
        },
      ],
    },
    {
      name: 'Symptom Checker Microservice',
      endpoints: [
        {
          name: 'CheckSymptoms',
          url: 'http://localhost:3007/check-symptoms',
          method: 'POST'
        },
      ],
    }
    
  ],
};

app.get('/service-dictionary', (req, res) => {
  res.json(serviceDictionary);
});

app.listen(port, () => {
  console.log(`Service Dictionary listening on port ${port}`);
});
