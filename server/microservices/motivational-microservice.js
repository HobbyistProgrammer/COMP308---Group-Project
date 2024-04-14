// product-microservice.js
const express = require('express');
const mongoose = require('mongoose');
const { graphqlHTTP } = require('express-graphql');
const {buildSchema } = require('graphql');
const app = express();
const port = 3004;
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

const motivationalSchema = new mongoose.Schema({
  tips: String,
});

const TipModel = mongoose.model('Tip', motivationalSchema);

const schema = buildSchema(`
  type Tip {
    id: ID,
    tips: String
  }

  type Query {
    getAllTips: [Tip]
  }

  type Mutation {
    addTip(tips: String!): Tip
    deleteMotivationalTip(id: ID!): Boolean
  }
`);

const root = {
  getAllTips: async () => {
    try{
      const tips = await TipModel.find();
      return tips;
    } catch (error) {
      throw new Error('Error getting tips');
    }
  },
  addTip: async ({ tips }) => {
    try{
      const tip = new TipModel({ tips: tips });
      //console.log('creating new object: ', tip);
      await tip.save();

      return tip;
    } catch (error) {
      throw new Error('Error creating tips');
    }
  },
  // deleteMotivationalTip: async ({ id }) => {
  //   try{
  //     console.log("deleting tip: ", id);
  //     const deletedTip = await TipModel.findByIdAndDelete(id);
  //     if (deletedTip) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   }catch (error) {
  //     console.error('Error deleting tip:', error);
  //     return false;
  //   }
  // },
}

app.use(express.json());

app.get('/tips', async (req, res) => {
  try{

    const tips = await root.getAllTips();
    res.json(tips);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post('/tips/add', async (req, res) => {
  try{
    //console.log('calling tips add');
    const { motivationalTip } = req.body;
    //console.log('called on tips:', motivationalTip);
    const newTip = await root.addTip({ tips: motivationalTip });
    //console.log('new tips worked: ', newTip);
    res.json(newTip);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.delete('/tips/delete/:id', async (req, res) => {
  try{
    const { id } = req.body;
    //console.log(id);
    const deleted = await TipModel.findByIdAndDelete(id);
    //console.log('new tips worked: ', newTip);
    res.json(deleted);
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
  console.log(`Motivational Tips Microservice listening on port ${port}`);
});
