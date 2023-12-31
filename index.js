const express = require('express');
const cors = require('cors');

require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.avrbnae.mongodb.net/?retryWrites=true&w=majority`;


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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const toysCollection = client.db('actionFigure').collection('toys');

    //toys

    app.get('/toys', async (req, res) => {
      let query = {}
      if (req.query?.email) {
        query = { email: req.query?.email }
      };
      const result = await toysCollection.find(query).toArray();
      res.send(result)
    })
    

    app.get('/toys', async (req, res) => {
      const cursor = toysCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });



    app.get('/toys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const option = {
        projection: { photo: 1, name: 1, seller: 1, email: 1, price: 1, rating: 1, quantity: 1, description: 1, }
      }

      const result = await toysCollection.findOne(query, option);
      res.send(result);
    });



    app.post('/toys', async (req, res) => {
      const toys = req.body;
      const result = await toysCollection.insertOne(toys);
      res.send(result);
    });

    app.patch('/toys/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const updatedToy = req.body;

      const updated = {
        $set: {
          quantity: updatedToy.quantity,
          price: updatedToy.price,
          description: updatedToy.description
        },
    };
    const result = await toysCollection.updateOne(filter, updated)
    res.send(result)
    })


  app.delete('/toys/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await toysCollection.deleteOne(query);
    res.send(result);
  })




  // Send a ping to confirm a successful connection
  await client.db("admin").command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
} finally {
  // Ensures that the client will close when you finish/error
  // await client.close();
}
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('action figure toy running')
});

app.listen(port, () => {
  console.log(`action figure toy running server port: ${port}`)
});


