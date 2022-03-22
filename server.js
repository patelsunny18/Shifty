'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const generator = require('generate-password');
const Bcrypt = require("bcryptjs");
const path = require('path');

// make webpage availible
const PORT = 8080;
const HOST = '0.0.0.0';
const app = express();


// importing the user models
const Employee = require('./models/employee');
const Manager = require('./models/manager');
const Owner = require('./models/owner');
const Schedule = require('./models/schedule');
const res = require('express/lib/response');

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

// make /public directory available for ejs
app.use(express.static(__dirname + '/public'))
// make /public/css directory available for external CSS
app.use(express.static(__dirname + '/public/css/'));

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
    res.render('removeManager');
});

app.get('/removeEmployee', (req, res) => {
    res.render('removeEmployee');
});

app.get('/viewSchedule', (req, res) => {
    res.render('viewSchedule');
});

app.get("/createSchedule", (req, res) => {
    res.render('createSchedule');
});

app.get('/owner/home/:id', async (req, res) => {
    const { id } = req.params;
    const owner = await Owner.findById({ _id: id });
    res.render('ownerHome', {
        id: id,
        name: `${owner.firstName} ${owner.lastName}`
    });
})

app.get('/manager/home/:id', async (req, res) => {
    const { id } = req.params;
    const manager = await Manager.findById({ _id: id });
    res.render('managerHome', {
        id: id,
        name: `${manager.firstName} ${manager.lastName}`
    });
})

app.get('/employee/home/:id', async (req, res) => {
    const { id } = req.params;
    const employee = await Employee.findById({ _id: id });
    res.render('employeeHome', {
        id: id,
        name: `${employee.firstName} ${employee.lastName}`
    });
})

app.get('/employee/changeAvailability/:id', async (req, res) => {
    const { id } = req.params;
    const employee = await Employee.findById({ _id: id });

    let availability = {};
    if (employee === null) {
        console.log("User not found!");
    } else {
        availability = employee.availability;
    }
    res.render('changeAvailability', {
        availability: JSON.stringify(availability),
        id: id
    });
});

app.get('/employee/viewSchedule/:id', async (req, res) => {
    const { id } = req.params;
    const employee = await Employee.findById({ _id: id });

    if (employee === null) {
        console.log("User not found");
    } else {
        res.render('employeeViewSchedule', {
            id: id
        });
    }
});

app.get('/employee/requestTimeoff/:id', async (req, res) => {
    const { id } = req.params;
    const employee = await Employee.findById({ _id: id });

    res.render('requestTimeoff', {
        id: id
    });
});

app.get("/editSchedule", (req, res) => {
    res.render('editSchedule')
})


app.post("/", function (req, res) {
    let id = req.body.userID;
    let password = req.body.password;

    Owner.findOne({ ownerID: id, password: password })
        .then((result) => {
            const data = {
                id: result._id,
                role: result.role
            }
            res.send(data);
            console.log("Owner logged in");
        })
        .catch((err) => {
            Manager.findOne({ managerID: id })
                .then((result) => {
                    const hash = result.password
                    Bcrypt.compare(password, hash, function (err, isMatch) {
                        if (err) {
                            throw err;
                        }
                        else if (!isMatch) {
                            console.log("Password doesn't match")
                        }
                        else if (isMatch) {
                            const data = {
                                id: result._id,
                                role: result.role
                            }
                            res.send(data);
                            console.log("Manager logged in");
                        }
                    })
                })
                .catch((err) => {
                    Employee.findOne({ employeeID: id })
                        .then((result) => {
                            const hash = result.password
                            Bcrypt.compare(password, hash, function (err, isMatch) {
                                if (err) {
                                    throw err;
                                }
                                else if (!isMatch) {
                                    console.log("Password doesn't match")
                                }
                                else if (isMatch) {
                                    const data = {
                                        id: result._id,
                                        role: result.role
                                    }
                                    res.send(data);
                                    console.log("Employee logged in");
                                }
                            })
                        })
                        .catch((err) => {
                            console.log("Oops! User doesn't exists!");
                            res.sendStatus(404);
                        })
                })
        })
});


app.post('/addEmployee', (req, res) => {
    try {
        const password = getPassword();
        const hashedPass = Bcrypt.hashSync(password, 10);
        const employeeID = getEmployeeId();
        const role = "Employee";
        const sin = req.body.sinNumber;
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
            password: hashedPass,
            availability: req.body.availability,
            wage: req.body.wage,
            role: role
        });

        Manager.find({ $or: [{ phoneNumber: req.body.phoneNumber }, { email: req.body.email }, { sin: req.body.sinNumber }] }, function (err, result) {
            console.log(result)
            if (err) throw err;
            console.log(result.length);
            if (result.length === 0) {
                insertEmployee.save()
                    .then((result) => {
                        let responseData = {
                            userID: employeeID,
                            password: password
                        };
                        res.send(responseData)
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }
            else {
                let sentence = "";
                if (result[0].phoneNumber === req.body.phoneNumber && result[0].email === req.body.email && result[0].sin === req.body.sinNumber) {
                    let sentence = "A manager with similar phone number, email and SIN number already exists in the system."
                }
                else if (result[0].phoneNumber === req.body.phoneNumber && result[0].email === req.body.email) {
                    sentence = "A manager with similar phone number and email already exists in the system."
                }
                else if (result[0].phoneNumber === req.body.phoneNumber && result[0].sin === req.body.sinNumber) {
                    sentence = "A manager with similar phone number and SIN number already exists in the system."
                }
                else if (result[0].email === req.body.email && result[0].sin === req.body.sinNumber) {
                    sentence = "A manager with similar email and SIN number already exists in the system."
                }
                else if (result[0].phoneNumber === req.body.phoneNumber) {
                    let sentence = "A manager with similar phone number already exists in the system."
                }
                else if (result[0].email === req.body.email) {
                    sentence = "A manager with similar email already exists in the system."
                }
                else if (result[0].sin === req.body.sinNumber) {
                    sentence = "A manager with similar SIN number already exists in the system."
                }
                let responseData = {
                    statusCode: 409,
                    message: sentence
                }
                res.send(responseData);
            }

        })
    }
    catch (err) {
        res.status(500).send(err);
    }
})

app.post('/removeEmployee', function (req, res) {
    try {
        let fName = req.body.firstName;
        let lName = req.body.lastName;
        let id = req.body.employeeID;
        var myquery = { firstName: fName, lastName: lName, employeeID: id };
        Employee.deleteOne(myquery)
            .then((result) => {
                console.log(result.deletedCount);
                if (result.deletedCount == 1) {
                    console.log("Employee removed from the system")
                    let responseData = {
                        first: fName,
                        last: lName
                    };
                    res.send(responseData)
                }
                else {
                    console.log("Employee doesn't exist in the system.")
                }
            })
            .catch((err) => {
                res.send(err)
            })
    }
    catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})


app.post('/removeManager', function (req, res) {
    try {
        let fName = req.body.firstName;
        let lName = req.body.lastName;
        let id = req.body.managerID;
        var myquery = { firstName: fName, lastName: lName, managerID: id };
        Manager.deleteOne(myquery)
            .then((result) => {
                console.log(result.deletedCount);
                if (result.deletedCount == 1) {
                    console.log("Manager removed from the system")
                    let responseData = {
                        first: fName,
                        last: lName
                    };
                    res.send(responseData)
                }
                else {
                    console.log("Manager doesn't exist in the system.")
                }
            })
            .catch((err) => {
                console.log(err)
                res.send(err)
            })
    }
    catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
})


app.post('/addManager', function (req, res) {
    try {
        const password = getPassword();
        const hashedPass = Bcrypt.hashSync(password, 10);
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
            password: hashedPass,
            availability: req.body.availability,
            role: role
        });

        Employee.find({ $or: [{ phoneNumber: req.body.phoneNumber }, { email: req.body.email }, { sin: req.body.sinNumber }] }, async (err, result) => {
            if (err) throw err;
            if (result.length === 0) {
                insertManager.save()
                    .then((result) => {
                        let responseData = {
                            userID: result.managerID,
                            password: password
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
    }
    catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
})

app.post('/createSchedule', async function (req, res) {
    var currentdate = new Date();
    var one = new Date(currentdate.getFullYear(), 0, 1);
    var numberOfDays = Math.floor((currentdate - one) / (24 * 60 * 60 * 1000));
    var weeknum = Math.ceil((currentdate.getDay() + 1 + numberOfDays) / 7);

    const insertSchedule = new Schedule({ schedule: req.body, week_number: weeknum })
    insertSchedule.save().then((result) => {
        console.log("Added successfully")
    }).catch((err) => {
        console.log(err)
    }
    );
})

app.get('/getSchedule', async function (req, res) {

    let currentdate = new Date();
    let one = new Date(currentdate.getFullYear(), 0, 1);
    let numberOfDays = Math.floor((currentdate - one) / (24 * 60 * 60 * 1000));
    let weeknum = Math.ceil((currentdate.getDay() + 1 + numberOfDays) / 7);

    const schedule = await Schedule.find({ week_number: weeknum }).then((result) => {
        if (result[0].schedule == undefined) {
            console.log('No Schedule')
        }
        else {
            console.log(result[0].schedule);
            res.status(200).send(result[0].schedule);
        }
    }
    )

});

app.put('/changeAvailability/:id', async (req, res) => {
    const { id } = req.params;
    const newAvailability = req.body.availability;
    const employee = await Employee.findByIdAndUpdate({ _id: `${id}` }, { availability: newAvailability });
    res.status(200).send("updated");
})

app.put('/editSchedule', async function (req, res) {
    let currentdate = new Date();
    let one = new Date(currentdate.getFullYear(), 0, 1);
    let numberOfDays = Math.floor((currentdate - one) / (24 * 60 * 60 * 1000));
    let weeknum = Math.ceil((currentdate.getDay() + 1 + numberOfDays) / 7);

    const schedule = await Schedule.findOneAndUpdate({ week_number: weeknum }, { schedule: req.body }).then((result) => {
        res.status(200).send('Sucess')
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

app.listen(PORT, HOST);

console.log("Server running");