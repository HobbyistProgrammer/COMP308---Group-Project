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
  ],
};

app.get('/service-dictionary', (req, res) => {
  res.json(serviceDictionary);
});

app.listen(port, () => {
  console.log(`Service Dictionary listening on port ${port}`);
});
