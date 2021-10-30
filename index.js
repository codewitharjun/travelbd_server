const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// Middleeare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4gdc0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('travelBd');
        const packageCullection = database.collection('packages')
        console.log('Database connected');

        //GET API
        app.get('/packages', async(req, res)=>{
            const cursor = packageCullection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        });
        
        //GET SINGLE API
        app.get('/packages/:id', async(req, res)=>{
            const id = req.params.id;
            console.log('Single data is loading', id);
            const query = {_id: ObjectId(id)};
            const package = await packageCullection.findOne(query);
            res.json(package);
        });

        //POST API 
        app.post('/packages', async(req, res) => {
            const package = req.body;
            const result = await packageCullection.insertOne(package);
            res.send(result);
        });

        app.get('/packages')
    }
    finally{
        // await client.close() 
    }

}
run().catch(console.dir);


// Check for Local host link
app.get('/', (req, res) => {
    res.send('Message From Srever');
});

// Check for running Server Port
app.listen(port, (req, res) => {
    console.log('Server is connected', port);
});



// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

// [
// {
//     "key": 1,
//     "name": "goa",
//     "Days": "3 days / 5days",
//     "price": 163,
//     "packImg": "https://i.ibb.co/6n2hMD7/13.jpg",
//     "bannerImg": "https://i.ibb.co/V93SMps/image.jpg",
//     "details": "details"
//   },
//   {
//     "key": 2,
//     "name": "Kerala",
//     "Days": "3 days / 4 days",
//     "price": 123,
//     "packImg": "https://i.ibb.co/6n2hMD7/13.jpg",
//     "bannerImg": "https://i.ibb.co/V93SMps/image.jpg",
//     "details": "details"
//   },
//   {
//     "key": 3,
//     "name": "Shundarbon",
//     "Days": "3 days / 4days",
//     "price": 117,
//     "packImg": "https://i.ibb.co/6n2hMD7/13.jpg",
//     "bannerImg": "https://i.ibb.co/V93SMps/image.jpg",
//     "details": "details"
//   },
//   {
//     "key": 4,
//     "name": "Manali",
//     "Days": "6 days / 7days",
//     "price": 43,
//     "packImg": "https://i.ibb.co/6n2hMD7/13.jpg",
//     "bannerImg": "https://i.ibb.co/V93SMps/image.jpg",
//     "details": "details"
//   }
// ]