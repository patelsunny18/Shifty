'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const generator = require('generate-password');
const path = require('path');

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

// set up ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/public/views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.render('login');
});

app.get('/addManager', (req, res) => {
    res.render('addManager');
});

app.get('/addEmployee', (req, res) => {
    res.render('addEmployee');
});

app.get('/removeManager', (req, res) => {
    res.sendFile('public/views/removeManager.html', { root: __dirname });
});

app.get('/removeEmployee', (req, res) => {
    res.sendFile('public/views/removeEmployee.html', { root: __dirname });
});

app.get('/viewSchedule', (req, res) => {
    res.sendFile('public/views/viewSchedule.html', { root: __dirname });
});

app.post("/", function (req, res) {
    let id = req.body.userID;
    let password = req.body.password;
    let role = "";

    Owner.findOne({ ownerID: id, password: password })
        .then((result) => {
            role = result.role;
            console.log("Owner logged in");
            res.send("Owner logged in");
        })
        .catch((err) => {
            Manager.findOne({ managerID: id, password: password })
                .then((result) => {
                    role = result.role;
                    console.log("Manager logged in");
                    res.send("Manager logged in");
                })
                .catch((err) => {
                    Employee.findOne({ employeeID: id, password: password })
                        .then((result) => {
                            role = result.role;
                            console.log("Employee logged in");
                            res.send("Employee logged in");
                        })
                        .catch((err) => {
                            console.log("Oops! User doesn't exists!");
                            res.sendStatus(404);
                        })
                })
        })
});



app.post('/addEmployee', function (req, res) {
    const password = getPassword();
    const employeeID = getEmployeeId();
    const role = "Employee";
    const insertEmployee = new Employee({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        dob: req.body.dob,
        email: req.body.email,
        bankAccountNumber: req.body.bankAccount,
        sin: req.body.sinNumber,
        employeeID: employeeID,
        password: password,
        availability: req.body.availability,
        wage: req.body.wage,
        role: role
    });

    Manager.find({ $or: [{ phoneNumber: req.body.phoneNumber }, { email: req.body.email }, { sin: req.body.sinNumber }] }, function (err, result) {
        if (err) throw err;
        if (result.length === 0) {
            insertEmployee.save()
                .then((result) => {
                    let responseData = {
                        userID: result.employeeID,
                        password: result.password
                    };
                    res.send(responseData)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
        else {
            if (result[0].phoneNumber == req.body.phoneNumber && result[0].email == req.body.email && result[0].sin == req.body.sinNumber) {
                console.log("A manager with similar phone number, email and SIN number already exists in the system.")
            }
            else if (result[0].phoneNumber == req.body.phoneNumber && result[0].email == req.body.email) {
                console.log("A manager with similar phone number and email already exists in the system.")
            }
            else if (result[0].phoneNumber == req.body.phoneNumber && result[0].sin == req.body.sinNumber) {
                console.log("A manager with similar phone number and SIN number already exists in the system.")
            }
            else if (result[0].email == req.body.email && result[0].sin == req.body.sinNumber) {
                console.log("A manager with similar email and SIN number already exists in the system.")
            }
            else if (result[0].phoneNumber == req.body.phoneNumber) {
                console.log("A manager with similar phone number already exists in the system.")
            }
            else if (result[0].email == req.body.email) {
                console.log("A manager with similar email already exists in the system.")
            }
            else if (result[0].sin == req.body.sinNumber) {
                console.log("A manager with similar SIN number already exists in the system.")
            }
        }
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
    const managerID = getManagerId();
    const role = "Manager";
    const insertManager = new Manager({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        dob: req.body.dob,
        email: req.body.email,
        bankAccountNumber: req.body.bankAccount,
        sin: req.body.sinNumber,
        managerID: managerID,
        password: password,
        availability: req.body.availability,
        role: role
    });

    Employee.find({ $or: [{ phoneNumber: req.body.phoneNumber }, { email: req.body.email }, { sin: req.body.sinNumber }] }, function (err, result) {
        if (err) throw err;
        if (result.length === 0) {
            insertManager.save()
                .then((result) => {
                    let responseData = {
                        userID: result.managerID,
                        password: result.password
                    };
                    res.send(responseData)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
        else {
            if (result[0].phoneNumber == req.body.phoneNumber && result[0].email == req.body.email && result[0].sin == req.body.sinNumber) {
                console.log("An employee with similar phone number, email and SIN number already exists in the system.")
            }
            else if (result[0].phoneNumber == req.body.phoneNumber && result[0].email == req.body.email) {
                console.log("An employee with similar phone number and email already exists in the system.")
            }
            else if (result[0].phoneNumber == req.body.phoneNumber && result[0].sin == req.body.sinNumber) {
                console.log("An employee with similar phone number and SIN number already exists in the system.")
            }
            else if (result[0].email == req.body.email && result[0].sin == req.body.sinNumber) {
                console.log("An employee with similar email and SIN number already exists in the system.")
            }
            else if (result[0].phoneNumber == req.body.phoneNumber) {
                console.log("An employee with similar phone number already exists in the system.")
            }
            else if (result[0].email == req.body.email) {
                console.log("An employee with similar email already exists in the system.")
            }
            else if (result[0].sin == req.body.sinNumber) {
                console.log("An employee with similar SIN number already exists in the system.")
            }
        }
    })
})

app.post('/removeManager', function (req, res) {
    var myquery = { firstName: req.body.fName, lastName: req.body.lName, managerID: req.body.id };
    Manager.deleteOne(myquery)
        .then((res) => {
            console.log("Manager removed from the system")
        })
        .catch((err) => {
            console.log(err)
        })
})

function getManagerId() {
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

function getEmployeeId() {
    var id = generator.generate({
        length: 6,
        numbers: true,
        uppercase: false,
        lowercase: false,
        symbols: false,
        excludeSimilarCharacters: true,
    });
    return id;
}

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

app.use('/', express.static('views'));

app.listen(PORT, HOST);

console.log("Server running");