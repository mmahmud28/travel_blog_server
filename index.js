const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require('express');
const { MongoClient, ServerApiVersion,  ObjectId } = require('mongodb');
const app = express();
const port = 5000 || process.env.PORT;
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');

app.use(cors());
app.use(express.json());



const uri = process.env.Mongo_DB;




app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});



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
    // Send a ping to confirm a successful connection

    const db = client.db("travel_agency");
    const collection = db.collection("destinations");


    app.get('/destinations', async (req, res) => {
      const cursor = collection.find();
      const destinations = await cursor.toArray();
      res.send(destinations);
    });


    app.post('/destinations', async (req, res) => {
      const destination = req.body;
      const result = await collection.insertOne(destination);
      res.send(result);
    })


    app.get('/destinations/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const destination = await collection.findOne(query);
      res.send(destination);
    });


    app.patch("/destinations/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;     
      
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
      );
      res.send(result);
    });

    app.delete("/destinations/:id", async (req, res) => {
      const {id} = req.params;
      const result = await collection.deleteOne({_id: new ObjectId (id)});
      res.send(result)
    })



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
     console.log(error);
  }
}
run().catch(console.dir);