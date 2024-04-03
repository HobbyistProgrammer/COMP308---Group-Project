// product-microservice.js
const express = require('express');
const mongoose = require('mongoose');
const { graphqlHTTP } = require('express-graphql');
const {buildSchema } = require('graphql');
const app = express();
const port = 3002;
const cors = require('cors')

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

const vitalsSchema = new mongoose.Schema({
  heartrate: Number,
  coretemp: String,
  bloodpressure: String,
  respiratoryrate: Number,
});

const VitalModel = mongoose.model('Vital', vitalsSchema);

const schema = buildSchema(`
  type Vital {
    id: ID
    heartrate: Int,
    coretemp: String,
    bloodpressure: String,
    respiratoryrate: Int
  }

  type Query {
    getAllVitals: [Vital]
  }

  type Mutation {
    addVital(heartrate: Int!, coretemp: String!, bloodpressure: String!, respiratoryrate: Int!): Vital
  }
`);

const root = {
  getAllVitals: async () => {
    try{
      const vitals = await VitalModel.find();
      return vitals;
    } catch (error) {
      throw new Error('Error getting Vitals');
    }
  },
  addVital: async ({ heartrate, coretemp, bloodPressure, respiratoryRate }) => {
    try{
      //console.log("Trying to add bp:", bloodPressure)
      const vital = new VitalModel({ heartrate: heartrate, coretemp: coretemp, bloodpressure: bloodPressure, respiratoryrate: respiratoryRate});
      //console.log("checking adding vitals: ", vital);
      await vital.save();
      return vital;
    } catch (error) {
      throw new Error('Error creating vitals');
    }
  },
}

app.use(express.json());

app.get('/vitals', async (req, res) => {
  try{
    //console.log("Trying to get vitals");
    const vitals = await root.getAllVitals();
    //console.log("Got Vitals: ", vitals);
    res.json(vitals);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post('/vitals/add', async (req, res) => {
  try{
    //TODO: Error checking, adding doesnt work.
    //console.log("Checcking Vitals: ", req.body);
    const { heartrate, coretemp, bloodPressure, respiratoryRate } = req.body;
    //console.log("Vitals: ", bloodPressure);
    const vital = await root.addVital({ heartrate, coretemp, bloodPressure, respiratoryRate });

    res.json(vital);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.put('/vitals/:id', async (req, res) => {
  try{
    const { id } = req.params;
    const { heartrate, coretemp, bloodPressure, respiratoryRate } = req.body;

    const vital = await VitalModel.findById(id);

    if(!vital){
      return res.status(404).send('Vitals not found');
    }

    vital.heartrate = heartrate;
    vital.coretemp = coretemp;
    vital.bloodpressure = bloodPressure;
    vital.respiratoryrate = respiratoryRate;

    console.log(vital);

    await vital.save();

    res.json(vital);
  } catch (error) {
    console.error('Error updating vitals: ', error);
    res.status(500).send('Internal Server Error');
  }
});

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(port, () => {
  console.log(`Vital Signs Microservice listening on port ${port}`);
});
