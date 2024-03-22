// product-microservice.js
const express = require('express');
const app = express();
const port = 3002;
const cors = require('cors')
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
  });
app.use(cors());
//
app.get('/products', (req, res) => {
  const products = [
    { id: 1, name: 'Product 1' },
    { id: 2, name: 'Product 2' },
    { id: 3, name: 'Product 3' },
  ];

  res.json(products);
});

app.listen(port, () => {
  console.log(`Product Microservice listening on port ${port}`);
});
