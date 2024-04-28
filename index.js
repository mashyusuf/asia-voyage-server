
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());


// mongodb server

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zuuvjs1.mongodb.net/?retryWrites=true&w=majority`;

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

        const touristSpotsCollection = client.db('spotsDB');
        const touristSpots = touristSpotsCollection.collection('spots');
            
        const countries = touristSpotsCollection.collection('Country');


        app.post('/addtourist', async (req, res) => {
            const newSpot = req.body;
            console.log(newSpot)
            const result = await touristSpots.insertOne(newSpot);
            res.send(result);
        });

        app.get('/addtourist', async (req, res) => {
            const cursor = touristSpots.find()
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/my-tourist-spots/:email', async (req, res) => {
            const email = req.params.email;
            const query ={user_email:email};           
            const cursor = touristSpots.find(query);           
            const result = await cursor.toArray();
            res.send(result);
        });
        app.get('/all-tourist-spots/:id', async (req, res) => {
            const id = req.params.id;
            const query ={'_id': new ObjectId(id)};           
            const cursor = touristSpots.find(query);           
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/all-countries', async (req, res) => {
            const cursor = countries.find();
            const result = await cursor.toArray();
            res.send(result);
        });
        app.get('/edit-mylist/:id', async (req, res) => {
            const id = req.params.id;
            const query ={'_id': new ObjectId(id)};           
            const cursor = touristSpots.find(query);           
            const result = await cursor.toArray();
            res.send(result);
        });
        // delete 

        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = {'_id': new ObjectId(id)};
            const result = await touristSpots.deleteOne(query);
            res.send(result);
        });
        // put or update methode

        app.put('/update-mylist/:id', async (req, res) => {
            const id = req.params.id;
            const update = req.body;
            const query = {'_id': new ObjectId(id)};
            const options = {upsert:true}
            const updateSpots = {
                $set: {
                     country_name:update.country_name,
                     average_cost:update.average_cost,
                     tourists_spot_name:update.tourists_spot_name,
                     average_cost:update.average_cost,

                }
            };
            const result = await touristSpots.updateOne(query, updateSpots, options);
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
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});