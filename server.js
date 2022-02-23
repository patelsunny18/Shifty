// Nicholas Heleta, nwh397, 11274059
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const mongoose = require('mongoose');


const mongoDB = "mongodb+srv://group10:CMPT370@project.yb52a.mongodb.net/CMPT370Project?retryWrites=true&w=majority"

mongoose.connect(mongoDB).then(((result) => console.log('connected to db'))).catch((err) => console.log(err));

// make webpage availible
const PORT = 8080;  
const HOST = '0.0.0.0';
const app = express();

app.use(bodyParser.urlencoded({extended: true}));


app.post('/postmessage',(req,res) => {

    let topic = "'"+req.body.topic+"'";
    let data = "'"+req.body.data+"'";


    res.send('ok');
});

app.use('/',express.static('pages'));

app.listen(PORT,HOST);

console.log("Server running");