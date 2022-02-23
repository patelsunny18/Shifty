// Nicholas Heleta, nwh397, 11274059
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// importing the user models
const Employee = require('./models/employee');
const Manager = require('./models/manager');
const Owner = require('./models/owner');

// Access to database
// DO NOT TOUCH!
const mongoDB = "mongodb+srv://group10:CMPT370@project.yb52a.mongodb.net/CMPT370Project?retryWrites=true&w=majority"
mongoose.connect(mongoDB)
.then((result) => {
    console.log("Connected to DB")
})
.catch((err) => {
    console.log(err)
})

// make webpage availible
const PORT = 8080;
const HOST = '0.0.0.0';
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// just an example to check if database is working
app.get('/createEmployee', (req, res) => {
    const test = new Employee({
        firstName: "Test",
        lastName: "Dummy",
        address: "abc road",
        phoneNumber: 1234567890,
        dob: '2022-02-22',
        email: 'test@email.com',
        bankAccountNumber: 987654321,
        sin: 20220223,
        employeeID: "test123",
        password: "iamdummy",
        availability: ["Monday", "Sunday"],
        wage: 12
    });
    test.save()
        .then((res) => {
            console.log(res)
        })
        .catch((err) => {
            console.log(err)
        })
})

// just an example to check if database is working
app.get('/createManager', (req, res) => {
    const test = new Manager({
        firstName: "Test",
        lastName: "Dummy",
        address: "abc road",
        phoneNumber: 1234567890,
        dob: '2022-02-22',
        email: 'test@email.com',
        bankAccountNumber: 987654321,
        sin: 20220223,
        managerID: "test123",
        password: "iamdummy",
        availability: ["Monday", "Sunday"],
    });
    test.save()
        .then((res) => {
            console.log(res)
        })
        .catch((err) => {
            console.log(err)
        })
})

app.use('/', express.static('views'));

app.listen(PORT, HOST);

console.log("Server running");