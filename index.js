const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.user_DB}:${process.env.pass_DB}@cluster0.xgolbpd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    console.log("You successfully connected to MongoDB✅!");

    const productCollection = client.db('emaJohnDB').collection('products');

    app.get('/products', async (req, res) => {
      const page = parseInt(req.query.page)
      const size = parseInt(req.query.size)
      console.log(page,size)
      const result = await productCollection.find()
      .skip(page * size)
      .limit(size)
      .toArray();
      res.send(result);
    })


    app.post('/productByIds', async (req, res) => {
      const ids= req.body
      const idswithObjectId= ids.map(id=> new ObjectId(id))
      const query= {_id:{$in:idswithObjectId}}
      const result= await productCollection.find(query).toArray()
      res.send(result)
    });


    app.get('/productsCount', async (req, res) => {
      const count = await productCollection.estimatedDocumentCount()
      res.send({count});
    })


  } catch (error) {
    console.error('error❌', error)
  }
}
run();


app.get('/', (req, res) => {
  res.send('john is busy shopping')
})

app.listen(port, () => {
  console.log(`ema john server is running on port: ${port}`);
})
