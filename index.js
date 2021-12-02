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
        const customerCullection = database.collection('customers')
        const orderCullection = database.collection('orders')
        const processingOrderCullection = database.collection('processingOrder')
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

        // Delete APII
        app.delete('/packages/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await packageCullection.deleteOne(query);
            res.json(result);
        })

        // ADD CUSTOMER
        app.post('/customers', async(req, res) => {
            const customer = req.body;
            const result = await customerCullection.insertOne(customer);
            res.send(result);
        });

        // GET CUSTOMER
        app.get('/customers/:email', async(req, res)=>{
            const email = req.params.email;
            console.log('Single data is loading', email);
            const customer = await customerCullection.findOne(email);
            res.json(customer);
        });

        // DELETE CUSTOMER
        app.delete('/customers/:email', async(req, res) => {
            const email = req.params.email;
            const result = await customerCullection.deleteOne(email);
            res.json(result);
        })




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
