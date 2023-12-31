const express = require("express");
const cors = require("cors");
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();


const port = process.env.PORT || 5000;



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0zyo6s3.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri);

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

    const productCollection = client.db('productDB').collection('product');

    const brandCollection = client.db('brandDB').collection('brand');


    const userCollection = client.db('productDB').collection('user');

    app.get('/product', async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);

    })
    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productCollection.findOne(query);
      res.send(result);


    })

    app.post('/product', async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct);
      res.send(result);

    })

    app.put('/product/:id', async (req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id) }
      const options = { upsert: true };
      const updateProduct = req.body;
      const product = {
        $set: {
          photo: updateProduct.photo,
          name: updateProduct.name,
          brand: updateProduct.brand,
          type: updateProduct.type,
          price: updateProduct.price,
          details: updateProduct.details,
          rating: updateProduct.rating
        },
      }
      const result = await productCollection.updateOne(filter, product, options);
      res.send(result);

    })

    app.delete('/cart/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const result = await productCollection.deleteOne(filter);
      res.send(result);
  })

  // brand related

  // app.get('/brand', async (req, res) => {
  //   const cursor = brandCollection.find();
  //   const result = await cursor.toArray();
  //   res.send(result);

  // })
  // app.get('/brand/:id', async (req, res) => {
  //   const id = req.params.id;
  //   const query = { _id: new ObjectId(id) }
  //   const result = await brandCollection.findOne(query);
  //   res.send(result);


  // })

  app.post('/brand', async (req, res) => {
    const newBrand = req.body;
    console.log(newBrand);
    const result = await brandCollection.insertOne(newBrand);
    res.send(result);

  })

 

    // user related apis

    app.get('/user', async(req, res) =>{
      const cursor = userCollection.find();
      const users = await cursor.toArray();
      res.send(users)
     
  })
    app.post('/user', async(req, res) =>{
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
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


// middleware

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send("Fashion and Apparel Website  is running...");
});


app.listen(port, () => {
  console.log(`Fashion and Apparel Website is running on port: ${port}`);
});









