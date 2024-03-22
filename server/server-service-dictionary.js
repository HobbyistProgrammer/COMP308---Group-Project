const express = require('express');
const app = express();
const port = 3001;

const serviceDictionary = {
  services: [
    {
      name: 'Product Microservice',
      endpoints: [
        {
          name: 'GetProducts',
          url: 'http://localhost:3002/products',
          method: 'GET',
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
  ],
};

app.get('/service-dictionary', (req, res) => {
  res.json(serviceDictionary);
});

app.listen(port, () => {
  console.log(`Service Dictionary listening on port ${port}`);
});
