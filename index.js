const express = require('express');
const cors = require('cors');
var jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const dotenv = require('dotenv');

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());
dotenv.config();


function createToken(user){
  const token = jwt.sign(
    {
      email: user.email
    },
    'secret',
    { expiresIn: '1d' }
  );

  return token;
}


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zdula.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const database = client.db("house_broker");
    const usersCollection = database.collection("users");
    const sellPostsCollection = database.collection("sellposts");
    const testimonialsCollection = database.collection("testimonials");
    const blogsCollection = database.collection("blogs");

    // sellposts post route
    app.post('/sellposts', async (req, res) =>{
      const sellPostData = req.body;
      const result = await sellPostsCollection.insertOne(sellPostData);
      res.send(result);
    });

    // sellposts get route
    app.get('/sellposts', async (req, res) =>{
      const sellPostsData = sellPostsCollection.find();
      const result = await sellPostsData.toArray();
      res.send(result);
    });

    // single sellpost get route
    
    app.get('/sellposts/:id', async (req, res) =>{
      const id = req.params.id;
      const result = await sellPostsCollection.findOne({_id: new ObjectId(id)});
      res.send(result);
    });

    // sellpost patch route
    app.patch('/sellposts/:id', async (req, res) =>{
      const id = req.params.id;
      const updatedData = req.body;
      const result = await sellPostsCollection.updateOne(
          {_id: new ObjectId(id)},
          {$set: updatedData}
      );
      res.send(result);
    });

    // sellpost delete route
    app.delete('/sellposts/:id', async (req, res) =>{
      const id = req.params.id;
      const result = await sellPostsCollection.deleteOne(
          {_id: new ObjectId(id)}
      );
      res.send(result);
    });

    // User Post Route
    app.post('/users', async(req, res) => {
      const user = req.body;
      const token = createToken(user);
      console.log(token);
      const checkUser = await usersCollection.findOne({ email: user?.email });
      
      if(checkUser?._id){
        return res.send({
          status: "success",
          message: "Login Success",
          token: token
        });
      }

      const result = await usersCollection.insertOne(user);
      res.send({result, token});
    });

    // User Get Route
    app.get('/users', async(req, res) => {
      const user = usersCollection.find();
      const result = await user.toArray();
      res.send(result);
    });

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
