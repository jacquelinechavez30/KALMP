'use strict'
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoClient } = require("mongodb");
require('dotenv').config();


//settings
const app = express();
const port = process.env.PORT || 3001;
app.set('json spaces', 2);

//mongodb connect
const uri = process.env.Mongo_uri;
//const uri = "mongodb://192.168.6.215:27017";

mongoose.Promise = global.Promise;
mongoose.connect(uri).then(db => console.log('conexion exitosa')).catch(err => console.log('error: ', err));

const client = new MongoClient(uri);

async function run() {
    try {
        const database = client.db('sample');
        const data = database.collection('data');
    } finally {
        await client.close();
    }
}

run().catch(console.dir);


//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); //Parse incoming requests with JSON payloads
app.use(cors());

//routes
app.use(require('./routes/index'));

//starting the server
app.listen(port, () => {
    console.log('Server listening on port ' + port)
})

//Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: "Something went wrong!" });
});
