// APIGatewayMicroFrontend.js
import React, { useEffect, useState } from 'react';

function APIGatewayMicroFrontend() {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registrationStatus, setRegistrationStatus] = useState('');

  const [products, setProducts] = useState(null);
  const [loginStatus, setLoginStatus] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('http://localhost:3002/products');
        console.log('response', response);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }

    fetchProducts();
  }, []);

  async function handleLogout() {
    try{
      const response = await fetch('http://localhost:3003/auth/logout', {
        method: 'POST',
      });

      const data = await response.text();
      setLoginStatus(data);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Error logging out: ', error);
    }
  }

  async function handleRegistration() {
    try{
      const response = await fetch('http://localhost:3003/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      //console.log(response);
      const data = await response.json();
      //console.log("Checking error");
      setRegistrationStatus(data.message);
    } catch (error) {
      console.error('Error Registering user: ', error);
      setRegistrationStatus('Error Registering user. Please Try again');
    }
  }

  async function handleLogin() {
    try {
      const response = await fetch('http://localhost:3003/auth/login', {
        method: 'POST',
      });
      console.log(response);
      const data = await response.text();
      setLoginStatus(data);
    } catch (error) {
      console.error('Error logging in:', error);
    }
  }

  return (
    <div>
      <h2>Product Microservice</h2>
      {products ? (
        <ul>
          {products.map((product) => (
            <li key={product.id}>{product.name}</li>
          ))}
        </ul>
      ) : (
        <p>Loading products...</p>
      )}
      <h2>User Registration</h2>
      <div>
        <form onSubmit={handleRegistration}>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button type="submit">Register</button>
        </form>
        {registrationStatus && <p>{registrationStatus}</p>}
      </div>
      <h2>User Authentication Microservice</h2>
      {!isLoggedIn ? (
        <button onClick={handleLogin}>Login</button>
      ) : (
        <div>
          <p>Welcome, User!</p>
          <button onClick={handleLogout}>Logout</button>
          </div>
      )}
      {loginStatus && <p>{loginStatus}</p>}
    </div>
  );
}

export default APIGatewayMicroFrontend;
