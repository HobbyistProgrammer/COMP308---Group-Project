// product-microservice.js
const express = require('express');
const mongoose = require('mongoose');
const { graphqlHTTP } = require('express-graphql');
const {buildSchema } = require('graphql');
const app = express();
const port = 3005;
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

const EmergencySchema = new mongoose.Schema({
  emergencyType: String,
  location: String,
  description: String,
});

const PatientVitalsSchema = new mongoose.Schema({
    heartrate: Number,
    coretemp: String,
    bloodpressure: String,
    respiratoryrate: Number,
    symptoms: [String],
  });

const EmergencyModel = mongoose.model('Emergency', EmergencySchema);
const PatientVitalsModel = mongoose.model('PatientVitals', PatientVitalsSchema);

const schema = buildSchema(`
  type Emergency {
    id: ID
    emergencyType: String
    location: String
    description: String
  }

  type PatientVitals {
    id: ID
    heartrate: Int,
    coretemp: String,
    bloodpressure: String,
    respiratoryrate: Int,
    symptoms: [String],
  }

  type Query {
    getAllEmergencies: [Emergency]
    getAllPatientVitals: [PatientVitals]
  }

  type Mutation {
    addEmergency(emergencyType: String!, location: String!, description: String!): Emergency
    addPatientVitals(heartrate: Int!, coretemp: String!, bloodpressure: String, respiratoryrate: Int!, symptoms: [String]!): PatientVitals
  }
`);

const root = {
    getAllEmergencies: async () => {
        try{
            const emergencies = await EmergencyModel.find();
            return emergencies;
        } catch (error) {
            throw new Error('Error getting emergencies');
        }
    },
    getAllPatientVitals: async () => {
        try{
            const vitals = await PatientVitalsModel.find();
            return vitals;
        } catch (error) {
            throw new Error('Error getting patient vitals');
        }
    },
    addEmergency: async ({ emergencyType, location, description }) => {
        try{
            //console.log("Trying to add emergency: ", emergencyType, location, description);
            const emergency = new EmergencyModel({ emergencyType: emergencyType, location: location, description: description });
            //console.log('creating new object: ', tip);
            await emergency.save();
            // console.log('finsihed creating emergency');
            return emergency;
        } catch (error) {
            throw new Error('Error creating Emergency');
        }
    },
    addPatientVitals: async ({ heartrate, coretemp, bloodpressure, respiratoryrate, symptoms }) => {
        try{
            const tip = new PatientVitalsModel({ heartrate: heartrate, coretemp: coretemp, bloodpressure: bloodpressure, respiratoryrate: respiratoryrate, symptoms: symptoms });
            //console.log('creating new object: ', tip);
            await tip.save();

            return tip;
        } catch (error) {
            throw new Error('Error creating Patient Vitals');
        }
    },
}

app.use(express.json());

app.get('/emergency', async (req, res) => {
  try{

    const emergencies = await root.getAllEmergencies();
    res.json(emergencies);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get('/patient', async (req, res) => {
    try{
  
      const vitals = await root.getAllPatientVitals();
      res.json(vitals);
    } catch (error) {
      res.status(400).send(error.message);
    }
  });
  
app.post('/emergency/add', async (req, res) => {
  try{
    const { emergencyType, location, description } = req.body;
    const newEmergency = await root.addEmergency({ emergencyType: emergencyType, location: location, description: description });
    // console.log(newEmergency);
    res.json(newEmergency);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post('/patient/add', async (req, res) => {
    try{
      const { patientHeartRate, patientCoreTemp, patientBloodPressure, patientRespiratoryRate, selectedSymptoms } = req.body;
      console.log(patientHeartRate, patientCoreTemp, patientBloodPressure, patientRespiratoryRate, selectedSymptoms);
      const newVitals = await root.addPatientVitals({ 
                                heartrate: patientHeartRate, 
                                coretemp: patientCoreTemp, 
                                bloodpressure: patientBloodPressure, 
                                respiratoryrate: patientRespiratoryRate, 
                                symptoms: selectedSymptoms 
        });
      res.json(newVitals);
    } catch (error) {
      res.status(400).send(error.message);
    }
  });
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(port, () => {
  console.log(`Patient-Emergency Microservice listening on port ${port}`);
});
