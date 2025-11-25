require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;

//middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Your local development
      "http://localhost:3000",
      "https://homehero-api-project-server.vercel.app/", // Your deployed frontend  // If you have a custom domain
    ],
    credentials: true,
  })
);
app.use(express.json());

//mongodb connection's
//homeHeroDB
//yOCKMNK4xyPdx3PQ

const uri = process.env.MONGO_URI;

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
    const bookingCollection = db.collection("bookings");

    app.get("/api/", (req, res) => res.send("Serverless backend working"));
    //here will have all the API
    app.post("/addServices", async (req, res) => {
      const serviceData = req.body;
      console.log(serviceData);
      const result = await servicesCollection.insertOne(serviceData);
      res.send(result);
    });

    app.get("/allServices", async (req, res) => {
      const allServiceData = servicesCollection.find();
      const result = await allServiceData.toArray();
      res.send(result);
    });

    app.get("/myServices", async (req, res) => {
      const email = req.query.email;
      if (!email) {
        res.send("email is required");
      }
      const result = await servicesCollection.find({ email: email }).toArray();
      res.send(result);
    });
    app.get("/home", async (req, res) => {
      const allService = await servicesCollection.find().limit(6).toArray();
      res.send(allService);
    });
    app.delete("/myServicesDelete", async (req, res) => {
      const { id } = req.query;
      const result = await servicesCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });
    app.get("/myServicesUpdate/:id", async (req, res) => {
      const id = req.params.id;
      const result = await servicesCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });
    app.put("/myServicesUpdate/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const query = { _id: new ObjectId(id) };
      const updateService = {
        $set: data,
      };
      const result = await servicesCollection.updateOne(query, updateService);
      res.send(result);
    });
    app.get("/servicesDetails/:id", async (req, res) => {
      const id = req.params.id;
      const result = await servicesCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    //Booking API's
    app.post("/bookings", async (req, res) => {
      const bookingData = req.body;
      const result = await bookingCollection.insertOne(bookingData);
      res.send(result);
    });
    app.get("/myBookings", async (req, res) => {
      try {
        const result = await bookingCollection
          .aggregate([
            {
              $addFields: {
                serviceObjId: { $toObjectId: "$serviceId" },
              },
            },
            {
              $lookup: {
                from: "services",
                localField: "serviceObjId",
                foreignField: "_id",
                as: "serviceDetails",
              },
            },
            { $unwind: "$serviceDetails" },
          ])
          .toArray();
        res.send(result);
      } catch (error) {
        console.log(error);
        res.send("Error fetching bookings");
      }
    });
    app.delete("/mybookings", async (req, res) => {
      const id = req.query;
      const result = await bookingCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });
    app.get("/isBooked", async (req, res) => {
      const { userEmail, serviceId } = req.query;
      const result = await bookingCollection.findOne({ userEmail, serviceId });
      res.send(!!result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

//API's
app.get("/", (req, res) => {
  res.send("server is running and get also working");
});

//listen PORT
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
