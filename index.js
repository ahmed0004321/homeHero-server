const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const cors = require("cors");
const port = process.env.port || 3000;

//middleware
app.use(cors());
app.use(express.json());

//mongodb connection's
//homeHeroDB
//yOCKMNK4xyPdx3PQ

const uri =
  "mongodb+srv://homeHeroDB:yOCKMNK4xyPdx3PQ@cluster007.lqqnzz4.mongodb.net/?appName=Cluster007";

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
    //database collections
    const db = client.db("homeHero_DB");
    const servicesCollection = db.collection("services");

    //here will have all the API
    app.post("/addServices/", async (req, res) => {
      const data = {
        serviceName: "AC Repair & Maintenance",
        category: "HVAC",
        price: 90,
        description:
          "Air conditioning repair, installation, and maintenance services. We service all major brands and ensure optimal cooling efficiency for your home.",
        imageUrl:
          "https://images.unsplash.com/photo-1631545806609-4c036b4d2e8b?w=800",
        providerName: "James Wilson",
        email: "james.wilson@homehero.com",
      };
      const result = await servicesCollection.insertOne(data);
      res.send(result);
    });
    //API's
    app.get("/", (req, res) => {
      res.send("server is running and get also working");
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

//listen PORT
app.listen(port, (req, res) => {
  console.log(`server is running on port ${port}`);
});
