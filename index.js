const express=require('express');
const cors=require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app=express();
const port= process.env.PORT || 5000;

//middlewares

app.use(express.json());
app.use(cors());


const uri =
  "mongodb+srv://motor-fixer-admin:gRbJlcb4zcsDnsI9@cluster0.7di2jdk.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const serviceCollection=client.db('motor-fixer').collection('services');
    const bookingCollection=client.db('motor-fixer').collection('booking');

    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/services/:id", async(req,res)=>{
      const id= req.params.id;
      const query={_id:new ObjectId(id)};
      const options={
        projection: {_id:0,service_id:1,price:1, title:1, img:1,}
      }
      const result= await serviceCollection.findOne(query,options);
      res.send(result);
    })

    app.post('/booking',async(req,res)=>{
      const booking=req.body;
      console.log(booking);
      const result=await bookingCollection.insertOne(booking);
      res.send(result);
    })

    app.get('/booking',async(req,res)=>{
      let query={};
      if(req.query?.email){
        query={email:req.query.email};
      }

      const result=await bookingCollection.find(query).toArray();
      res.send(result);
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('motor fixer server is running');
})



app.listen(port,()=>{
    console.log(`server listening at port ${port}`)
})