// microservice-auth.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { graphqlHTTP } = require('express-graphql');
const {buildSchema } = require('graphql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();
const port = 3003;

app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from this origin
  credentials: true // Allow sending cookies in CORS requests
}));

// console.log('checking mongodb connection');
mongoose.connect('mongodb://127.0.0.1:27017/service');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});

// MongoDB Schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  isnurse: Boolean,
});

const UserModel = mongoose.model('User', userSchema);

// GraphQL Schemas
const schema = buildSchema(`
  type User {
    id: ID,
    username: String,
    email: String,
    isnurse: Boolean
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!, isnurse: Boolean!): User
    login(email: String!, password: String!): User
    logout: String
  }
`);

const root = {
  signup: async ({ username, email, password, isnurse }) => {
    try{
      //console.log("Hashing password");
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("creating user", username, email, password, isnurse);
      const user = new UserModel({ username, email, password: hashedPassword, isnurse });
      await user.save();
      return user;
    } catch (error) {
      throw new Error('Error signing up user');
    }
  },
  login: async ({ email, password}) => {
    
    const user = await UserModel.findOne({ email });
    console.log("User found:", user);
  
    if (!user) {
      throw new Error('User not found');
    }
  
    //console.log("Checking valid password");
    const validPassword = await bcrypt.compare(password, user.password);
    //console.log("Valid Password:", validPassword);
  
    if (!validPassword) {
      throw new Error('Invalid Password');
    }

    const token = jwt.sign({ userId: user._id }, 'mySecret', { expiresIn: '1h' });
    // console.log("Token generated:", token);
  
    return { token, user };
  },
}

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, 'mySecret', (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.user = user;
    next();
  });
};

app.use(express.json());

app.post('/auth/login', async (req, res) => {
  try{
    //console.log("trying sign in");
    const { email, password } = req.body;
    //console.log("grabbing params: ", email, password);
    const { token, user } = await root.login({ email, password });
    console.log("logging: ", user);

    res.json({ token, user });
  } catch (error) {
    res.status(401).send(error.message);
  }
});

app.post('/auth/signup', async (req, res) => {
  try{
    const { username, email, password, isnurse } = req.body;
    console.log(req.body);
    const user = await root.signup({ username, email, password, isnurse });
    console.log("registering user: ", user);
    res.json(user);

  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post('/auth/logoff', async (req, res) => {
  try{
    res.send('Logged Out');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.use('/graphql', authenticateToken, graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(port, () => {
  console.log(`User Authentication Microservice listening on port ${port}`);
});
