// Nicholas Heleta, nwh397, 11274059
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const generator = require('generate-password');

// make webpage availible
const PORT = 8080;
const HOST = '0.0.0.0';
const app = express();


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

app.use(bodyParser.urlencoded({ extended: true }));


app.post("/login", function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var selected = req.body.optradio;
    console.log(selected);
    if (selected == "1") {
        Owner.findOne({ email: email, password: password }, function (err, user) {
            if (err || !user) {
                console.log("User not found.")
            } else {
                console.log("Log In Successful");
            }
        })
    }
    if (selected == "2") {
        Manager.findOne({ email: email, password: password }, function (err, user) {
            if (err || !user) {
                console.log("User not found.")
            } else {
                console.log("Log In Successful");
            }
        })
    }
    if (selected == "3") {
        Employee.findOne({ email: email, password: password }, function (err, user) {
            if (err || !user) {
                console.log("User not found.")
            } else {
                console.log("Log In Successful");
            }
        })
    }
});



app.post('/addEmployee', function (req, res) {
    const password = getPassword();
    const employeeID = getId();
    const insertEmployee = new Employee({
        firstName: req.body.fName,
        lastName: req.body.lName,
        address: req.body.address,
        phoneNumber: req.body.phoneInput,
        dob: req.body.date,
        email: req.body.emailInput,
        bankAccountNumber: req.body.bankAccount,
        sin: req.body.SinNumber,
        employeeID: employeeID,
        password: password,
        availability: req.body.avail,
        wage: req.body.wage
    });
    insertEmployee.save()
        .then((res) => {
            console.log(employeeID)
            console.log(password)
        })
        .catch((err) => {
            console.log(err)
        })
})

app.post('/removeEmployee', function (req, res) {
    var myquery = { firstName: req.body.fName, lastName: req.body.lName, employeeID: req.body.id };
    Employee.deleteOne(myquery, function (err, obj) {
        if (err) throw err;
        console.log("Employee removed from the system.");
    });
})

app.post('/addManager', function (req, res) {
    const password = getPassword();
    const managerID = getId();
    const insertManager = new Manager({
        firstName: req.body.fName,
        lastName: req.body.lName,
        address: req.body.address,
        phoneNumber: req.body.phoneInput,
        dob: req.body.date,
        email: req.body.emailInput,
        bankAccountNumber: req.body.bankAccount,
        sin: req.body.SinNumber,
        managerID: managerID,
        password: password,
        availability: req.body.avail
    });
    insertManager.save()
        .then((res) => {
            console.log(managerID)
            console.log(password)
        })
        .catch((err) => {
            console.log(err)
        })
})

app.post('/removeManager', function (req, res) {
    var myquery = { firstName: req.body.fName, lastName: req.body.lName, managerID: req.body.id };
    Manager.deleteOne(myquery)
        .then((res) => {
            console.log("Manager removed from the system")
        })
        .catch((err) =>{
            console.log(err)
        })
    // Manager.deleteOne(myquery, function (err, obj) {
    //     if (err) {
    //         console.log(err)
    //     }
    //     else {
    //         console.log("Manager removed from the system.");
    //     }
    // });
})

function getId() {
    var id = generator.generate({
        length: 7,
        numbers: true,
        uppercase: false,
        lowercase: false,
        symbols: false,
        excludeSimilarCharacters: true,
    });
    return id;
}
// console.log(getEmployeeId());

function getPassword() {
    var min = Math.ceil(6);
    var max = Math.floor(9);
    var randNumber = Math.floor(Math.random() * (max - min + 1) + min);
    var password = generator.generate({
        length: randNumber,
        numbers: true,
        uppercase: true,
        lowercase: true,
        symbols: false,
        excludeSimilarCharacters: true,
        strict: true
    });
    return password;
}
// console.log(getPassword());


app.use('/', express.static('views'));

app.listen(PORT, HOST);

console.log("Server running");