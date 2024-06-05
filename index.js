const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv');

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());
dotenv.config();



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zdula.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);



app.get('/', (req, res)=>{
    res.send('Route is Working')
});


app.listen(port, (req, res)=>{
    console.log('Server in running on port:', port)
});


// user: house_broker
// pass: 2CsxLW3CzNSDehJJ