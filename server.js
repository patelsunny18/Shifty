'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const generator = require('generate-password');
const Bcrypt = require("bcryptjs");
const path = require('path');
const startOfWeek = require('date-fns/startOfWeek')
const endOfWeek = require('date-fns/endOfWeek')
const format = require('date-fns/format')

// make webpage availible
const PORT = 8080;
const HOST = '0.0.0.0';
const app = express();


// importing the user models
const Employee = require('./models/employee');
const Manager = require('./models/manager');
const Owner = require('./models/owner');
const Schedule = require('./models/schedule');

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

// GET route to login page
app.get('/', (req, res) => {
    res.render('login');
});

// GET route to Owner home
app.get('/owner/home/:id', async (req, res) => {
    const { id } = req.params;
    let owner = null;

    // try to find the owner with the given ID
    try {
        owner = await Owner.findById({ _id: id });
    } catch (error) {
        res.redirect('/error');
    }

    // if found
    if (owner) {
        res.render('ownerHome', {
            id: id,
            name: `${owner.firstName} ${owner.lastName}`
        });
    }
});

// GEt route to Manager home
app.get('/manager/home/:id', async (req, res) => {
    const { id } = req.params;
    let manager = null;

    // try to find the manager with the given ID
    try {
        manager = await Manager.findById({ _id: id });
    } catch (error) {
        res.redirect('/error');
    }

    // if found
    if (manager) {
        res.render('managerHome', {
            id: id,
            name: `${manager.firstName} ${manager.lastName}`
        });
    }
});

// GET route to Employee home
app.get('/employee/home/:id', async (req, res) => {
    const { id } = req.params;
    let employee = null;

    // try to find the employee with the given ID
    try {
        employee = await Employee.findById({ _id: id });
    } catch (error) {
        res.redirect('/error');
    }

    // if found
    if (employee) {
        res.render('employeeHome', {
            id: id,
            name: `${employee.firstName} ${employee.lastName}`
        });
    }
});

// GET route to createSchedule for Owner
app.get('/owner/createSchedule/:id', async (req, res) => {
    const { id } = req.params;
    let owner = null;

    // try to find the owner with the given ID
    try {
        owner = Owner.findById({ _id: id });
    } catch (error) {
        res.redirect('/error');
    }

    // if found
    if (owner) {
        res.render('ownerCreateSchedule', {
            id: id
        });
    }
});

// GET route to createSchedule for Manager
app.get('/manager/createSchedule/:id', async (req, res) => {
    const { id } = req.params;
    let manager = null;

    // try to find the manager with the given ID
    try {
        manager = await Manager.findById({ _id: id });
    } catch (error) {
        res.redirect('/error');
    }

    // if found
    if (manager) {
        res.render('managerCreateSchedule', {
            id: id
        });
    }
});

// GET route to editSchedule for Owner
app.get('/owner/editSchedule/:id', async (req, res) => {
    const { id } = req.params;
    let owner = null;

    // try to find the owner with the given ID
    try {
        owner = Owner.findById({ _id: id });
    } catch (error) {
        res.redirect('/error');
    }

    // if found
    if (owner) {
        res.render('ownerEditSchedule', {
            id: id
        });
    }
});

// GET route to editSchedule for Manager
app.get('/manager/editSchedule/:id', async (req, res) => {
    const { id } = req.params;
    let manager = null;

    // try to find the manager with the given ID
    try {
        manager = await Manager.findById({ _id: id });
    } catch (error) {
        res.redirect('/error');
    }

    // if found
    if (manager) {
        res.render('managerEditSchedule', {
            id: id
        });
    }
});

// GET route to viewSchedule for Owner
app.get('/owner/viewSchedule/:id', async (req, res) => {
    const { id } = req.params;
    let owner = null;

    // try to find the owner with the given ID
    try {
        owner = Owner.findById({ _id: id });
    } catch (error) {
        res.redirect('/error');
    }

    // if found
    if (owner) {
        res.render('ownerViewSchedule', {
            id: id
        });
    }
});

// GET route to viewSchedule for Manager
app.get('/manager/viewSchedule/:id', async (req, res) => {
    const { id } = req.params;
    let manager = null;

    // try to find the manager with the given ID
    try {
        manager = await Manager.findById({ _id: id });
    } catch (error) {
        res.redirect('/error');
    }

    // if found
    if (manager) {
        res.render('managerViewSchedule', {
            id: id
        });
    }
});

// GET route to addManager for Owner
app.get('/owner/addManager/:id', async (req, res) => {
    const { id } = req.params;
    let owner = null;

    // try to find the owner with the given ID
    try {
        owner = Owner.findById({ _id: id });
    } catch (error) {
        res.redirect('/error');
    }

    // if found
    if (owner) {
        res.render('ownerAddManager', {
            id: id
        });
    }
});

// GET route to removeManager for Owner
app.get('/owner/removeManager/:id', async (req, res) => {
    const { id } = req.params;
    let owner = null;

    // try to find the owner with the given ID
    try {
        owner = Owner.findById({ _id: id });
    } catch (error) {
        res.redirect('/error');
    }

    // if found
    if (owner) {
        res.render('ownerRemoveManager', {
            id: id
        });
    }
});

// GET route to addEmployee for Owner
app.get('/owner/addEmployee/:id', async (req, res) => {
    const { id } = req.params;
    let owner = null;

    // try to find the owner with the given ID
    try {
        owner = Owner.findById({ _id: id });
    } catch (error) {
        res.redirect('/error');
    }

    // if found
    if (owner) {
        res.render('ownerAddEmployee', {
            id: id
        });
    }
});

// GET route to addEmployee for Manager
app.get('/manager/addEmployee/:id', async (req, res) => {
    const { id } = req.params;
    let manager = null;

    // try to find the manager with the given ID
    try {
        manager = await Manager.findById({ _id: id });
    } catch (error) {
        res.redirect('/error');
    }

    // if found
    if (manager) {
        res.render('managerAddEmployee', {
            id: id
        });
    }
});

// GET route to removeEmployee for Owner
app.get('/owner/removeEmployee/:id', async (req, res) => {
    const { id } = req.params;
    let owner = null;

    // try to find the owner with the given ID
    try {
        owner = Owner.findById({ _id: id });
    } catch (error) {
        res.redirect('/error');
    }

    // if found
    if (owner) {
        res.render('ownerRemoveEmployee', {
            id: id
        });
    }
});

// GET route to removeEmployee for Manager
app.get('/manager/removeEmployee/:id', async (req, res) => {
    const { id } = req.params;
    let manager = null;

    // try to find the manager with the given ID
    try {
        manager = await Manager.findById({ _id: id });
    } catch (error) {
        res.redirect('/error');
    }

    // if found
    if (manager) {
        res.render('managerRemoveEmployee', {
            id: id
        });
    }
});

// GET route to changeAvailability for Employee
app.get('/employee/edit/:id', async (req, res) => {
    const { id } = req.params;
    const employee = await Employee.findById({ _id: id });
    let date = employee.dob;
    let stringDate = (date.toLocaleDateString('pt-BR', { timeZone: "GMT", month: "numeric", day: "numeric", year: "numeric" })); res.render('edit', {
        id: id,
        name: `${employee.firstName} ${employee.lastName}`,
        fName: employee.firstName,
        lName: employee.lastName,
        address: employee.address,
        phoneNumber: employee.phoneNumber,
        dob: stringDate,
        email: employee.email,
        bank: employee.bankAccountNumber,
        sin: employee.sin,
        wage: employee.wage,
        availability: employee.availability,
        employeeID: employee.employeeID,
        password: "*********"
    });
});

app.get('/employee/changeAvailability/:id', async (req, res) => {
    const { id } = req.params;
    let employee = null;

    // try to find the employee with the given ID
    try {
        employee = await Employee.findById({ _id: id });
    } catch (error) {
        res.redirect('/error');
    }

    // if found
    if (employee) {
        let availability = {};

        availability = employee.availability;
        res.render('changeAvailability', {
            availability: JSON.stringify(availability),
            id: id
        });
    }
});

app.get('/manager/changeAvailabilityManager/:id', async (req, res) => {
    const { id } = req.params;
    const manager = await Manager.findById({ _id: id });

    let availability = {};
    if (manager === null) {
        console.log("User not fou nd!");
    } else {
        availability = manager.availability;
    }
    res.render('changeAvailability', {
        availability: JSON.stringify(availability),
        id: id
    });
})

// GET route to viewSchedule for Employee
app.get('/employee/viewSchedule/:id', async (req, res) => {
    const { id } = req.params;
    let employee = null;

    // try to find the employee with the given ID
    try {
        employee = await Employee.findById({ _id: id });
    } catch (error) {
        res.redirect('/error');
    }

    // if found
    if (employee === null) {
        console.log("User not found");
    } else {
        res.render('employeeViewSchedule', {
            id: id
        });
    }
});

// GET route to requestTimeoff for Employee
app.get('/employee/requestTimeoff/:id', async (req, res) => {
    const { id } = req.params;
    let employee = null;

    // try to find the employee with the given ID
    try {
        employee = await Employee.findById({ _id: id });
    } catch (error) {
        res.redirect('/error');
    }

    // if found
    if (employee) {
        res.render('requestTimeoff', {
            id: id
        });
    }
});


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
                            fName: result.firstName,
                            lName: result.lastName,
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
                        console.log(result);
                        let responseData = {
                            fName: result.firstName,
                            lName: result.lastName,
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

    let day = new Date(req.body.date)
    let start = startOfWeek(day)
    let end = endOfWeek(day)

    let week = format(start, "yyyy-MM-dd") + " " + format(end, "yyyy-MM-dd")

    const schedule = await Schedule.find({ week: week }).then((result) => {
        if (result.length > 0) {
            console.log('existing Schedule')
            res.status(406).send()
        }
        else {
            // Make this in the else of the function above, have it send res code 200
            const insertSchedule = new Schedule({ schedule: req.body.shifts, week: week })
            insertSchedule.save().then((result_s) => {
                console.log("Added successfully")
                res.status(200).send()
            }).catch((err) => {
                console.log(err)
            }
            );
        }

    })

})

app.post('/getSchedule', async function (req, res) {


    let day = req.body.date


    const schedule = await Schedule.find({ week: day }).then((result) => {
        if (result.length == 0) {
            console.log('No Schedule')
        }
        else {
            res.status(200).send(result[0].schedule);
        }
    }
    )

});

app.get('/getNames', async function (req, res) {
    const names = await Employee.find({}).select('firstName -_id').then((result) => {
        res.status(200).send(result);
    })
})

app.get('/getWeeks', async function (req, res) {
    const weeks = await Schedule.find({}).select('week -_id').then((result) => {
        res.status(200).send(result);
    })
})

app.post('/getAvailability', async function (req, res) {

    const name = await Employee.find({ firstName: req.body.name }).select('availability -_id').then((result) => {
        res.send(result);
    })
})

// app.put('/edit/:id', async (req, res) => {
//     const { id } = req.params;
//     const newAvailability = req.body.availability;
//     const employee = await Employee.findByIdAndUpdate({ _id: `${id}` }, { availability: newAvailability });
//     res.status(200).send("updated");
// })

app.put('/changeAvailability/:id', async (req, res) => {
    const { id } = req.params;
    const newAvailability = req.body.availability;
    const employee = await Employee.findByIdAndUpdate({ _id: `${id}` }, { availability: newAvailability });
    res.status(200).send("updated");
})

app.put('/changeAvailabilityManager/:id', async (req, res) => {
    const { id } = req.params;
    const newAvailability = req.body.availability;
    const manager = await Manager.findByIdAndUpdate({ _id: `${id}` }, { availability: newAvailability });
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

// GET route to error page
app.get('/error', (req, res) => {
    res.render('error');
});

// GET route to any incorrect URL
app.get('*', (req, res) => {
    res.render('error');
});

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