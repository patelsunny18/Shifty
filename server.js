'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const generator = require('generate-password');
const Bcrypt = require("bcryptjs");
const path = require('path');
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);
const startOfWeek = require('date-fns/startOfWeek')
const endOfWeek = require('date-fns/endOfWeek')
const format = require('date-fns/format')
const getDay = require('date-fns/getDay')
const isSameWeek = require('date-fns/isSameWeek')
const addDays = require('date-fns/addDays');
const parseISO = require('date-fns/parseISO');

// make webpage availible
const PORT = 8080;
const HOST = '0.0.0.0';
const app = express();


// importing the user models
const Employee = require('./models/employee');
const Manager = require('./models/manager');
const Owner = require('./models/owner');
const Schedule = require('./models/schedule');
const Timeoff = require('./models/timeoff');
const Shift = require('./models/shift');


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

const store = new MongoDBSession({
    uri: mongoDB,
    collection: 'sessions'
});

// set up ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/public/views'));

// set up session
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        store: store
    })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// make /public directory available for ejs
app.use(express.static(__dirname + '/public'))
// make /public/css directory available for external CSS
app.use(express.static(__dirname + '/public/css/'));

// check if owner is logged in
const isOwner = (req, res, next) => {
    if (req.session.isOwner) {
        next();
    } else {
        res.redirect('/');
    }
}

// check if manager is logged in
const isManager = (req, res, next) => {
    if (req.session.isManager) {
        next();
    } else {
        res.redirect('/');
    }
}

// check if employee is logged in
const isEmployee = (req, res, next) => {
    if (req.session.isEmployee) {
        next();
    } else {
        res.redirect('/');
    }
}

// GET route to login page
app.get('/', (req, res) => {
    res.render('login');
});

// GET route to Owner home
app.get('/owner/home/:id', isOwner, async (req, res) => {
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
app.get('/manager/home/:id', isManager, async (req, res) => {
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
app.get('/employee/home/:id', isEmployee, async (req, res) => {
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
app.get('/owner/createSchedule/:id', isOwner, async (req, res) => {
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
app.get('/manager/createSchedule/:id', isManager, async (req, res) => {
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

// GET route to ApproveTimeoff for Manager
app.get('/manager/approveTimeoff/:id', isManager, async (req, res) => {
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
        res.render('managerApproveTimeoff', {
            id: id
        });
    }
});

// GET route to ApproveTimeoff for Manager
app.get('/owner/approveTimeoff/:id', isOwner, async (req, res) => {
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
        res.render('ownerApproveTimeoff', {
            id: id
        });
    }
});

// GET route to editSchedule for Owner
app.get('/owner/editSchedule/:id', isOwner, async (req, res) => {
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
app.get('/manager/editSchedule/:id', isManager, async (req, res) => {
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
app.get('/owner/viewSchedule/:id', isOwner, async (req, res) => {
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
app.get('/manager/viewSchedule/:id', isManager, async (req, res) => {
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
app.get('/owner/addManager/:id', isOwner, async (req, res) => {
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
app.get('/owner/removeManager/:id', isOwner, async (req, res) => {
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
app.get('/owner/addEmployee/:id', isOwner, async (req, res) => {
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
app.get('/manager/addEmployee/:id', isManager, async (req, res) => {
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
app.get('/owner/removeEmployee/:id', isOwner, async (req, res) => {
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
app.get('/manager/removeEmployee/:id', isManager, async (req, res) => {
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

app.get('/employee/edit/:id', isEmployee, async (req, res) => {
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
        let name = `${employee.firstName} ${employee.lastName}`;
        let firstName = employee.firstName;
        let lastName = employee.lastName;
        let address = employee.address;
        let phoneNumber = employee.phoneNumber;
        let date = employee.dob;
        let stringDate = (date.toLocaleDateString('pt-BR', { timeZone: "GMT", month: "numeric", day: "numeric", year: "numeric" }));
        let email = employee.email;
        let bank = employee.bankAccountNumber;
        let sin = employee.sin;
        let employeeID = employee.employeeID;
        res.render('edit', {
            name: name,
            fName: firstName,
            lName: lastName,
            address: address,
            phone: phoneNumber,
            dob: stringDate,
            email: email,
            bank: bank,
            password: "*********",
            sin: sin,
            employeeID: employeeID,
            id: id
        });
    }
});

app.get('/manager/managerEdit/:id', isManager, async (req, res) => {
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
        let name = `${manager.firstName} ${manager.lastName}`;
        let firstName = manager.firstName;
        let lastName = manager.lastName;
        let address = manager.address;
        let phoneNumber = manager.phoneNumber;
        let date = manager.dob;
        let stringDate = (date.toLocaleDateString('pt-BR', { timeZone: "GMT", month: "numeric", day: "numeric", year: "numeric" }));
        let email = manager.email;
        let bank = manager.bankAccountNumber;
        let sin = manager.sin;
        let managerID = manager.managerID;
        res.render('managerEdit', {
            name: name,
            fName: firstName,
            lName: lastName,
            address: address,
            phone: phoneNumber,
            dob: stringDate,
            email: email,
            bank: bank,
            password: "*********",
            sin: sin,
            managerID: managerID,
            id: id
        });
    }
});


// GET route to changeAvailability for Employee
app.get('/employee/changeAvailability/:id', isEmployee, async (req, res) => {
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

app.get('/manager/changeAvailabilityManager/:id', isManager, async (req, res) => {
    const { id } = req.params;
    let manager = null;

    // try to find the employee with the given ID
    try {
        manager = await Manager.findById({ _id: id });
    } catch (error) {
        res.redirect('/error');
    }

    // if found
    if (manager) {
        let availability = {};
        availability = manager.availability;
        res.render('changeAvailabilityManager', {
            availability: JSON.stringify(availability),
            id: id
        });
    }
});

// GET route to viewSchedule for Employee
app.get('/employee/viewSchedule/:id', isEmployee, async (req, res) => {
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
app.get('/employee/requestTimeoff/:id', isEmployee, async (req, res) => {
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

// GET route to availableShifts for Employee
app.get('/employee/availableShifts/:id', async (req, res) => {
    const { id } = req.params;
    let employee = null;

    // try to find the employee with the given ID
    try {
        employee = await Employee.findById({ _id: id });
    } catch (error) {
        res.redirect('/error');
    }
    let shifts = null;
    try {
        shifts = await Shift.find({});
    } catch (error) {
        console.log(error);
    }

    // if found
    if (employee && shifts) {
        res.render('availableShifts', {
            id: id,
            shifts: shifts
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
            // res.send(data);
            // req.session.isAuth = true;
            req.session.isOwner = true;
            res.redirect('/owner/home/' + result._id);
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
                            // res.send(data);
                            // req.session.isAuth = true;
                            req.session.isManager = true;
                            res.redirect('/manager/home/' + result._id);
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
                                    // res.send(data);
                                    // req.session.isAuth = true;
                                    req.session.isEmployee = true;
                                    res.redirect('/employee/home/' + result._id);
                                    console.log("Employee logged in");
                                }
                            })
                        })
                        .catch((err) => {
                            res.redirect('/');
                            console.log("Oops! User doesn't exists!");
                        })
                })
        })
});

app.post('/logout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Logged out");
            res.redirect('/');
        }
    });
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
            // acquire all approved timeoffs
            const weeks = Timeoff.find({ approve: true }).select('-_id').then((result) => {
                let flag = true
                if (result.length != 0) {
                    for (let h = 0; h < result.length; h++) {
                        flag = checkTimeoff(req.body, result[h])
                        if (flag === false) {
                            res.status(208).send("Timeoff catch")
                        }
                    }
                }
                if (flag == true) {
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

app.get('/getTimeoffs', async function (req, res) {
    const weeks = await Timeoff.find({ approve: false }).select('-_id').then((result) => {
        res.status(200).send(result);
    })
})

app.post('/getAvailability', async function (req, res) {

    const name = await Employee.find({ firstName: req.body.name }).select('availability -_id').then((result) => {
        res.send(result);
    })
})

app.put('/editPass/:id', async (req, res) => {
    const { id } = req.params;
    const curPass = req.body.curPassword;
    const newPass = req.body.newPassword;
    const hashedNewPass = Bcrypt.hashSync(newPass, 10);
    const employee = await Employee.findById({ _id: `${id}` })
        .then((result) => {
            if (result.length == 0) {
                res.send("Employee Doesn't Exist")
            }
            else {
                const hash = result.password;
                Bcrypt.compare(curPass, hash, (err, result) => {
                    if (err) {
                        throw err;
                    }
                    else if (!result) {
                        console.log("Incorrect Current Password");
                        res.status(210).send("Incorrect Current Password. Retry");
                    }
                    else if (result) {
                        Employee.findByIdAndUpdate(
                            { _id: `${id}` },
                            { password: hashedNewPass },
                            function (err, result) {
                                if (err) {
                                    res.status(210).send(err);
                                } else {
                                    console.log("Done");
                                    res.status(200).send("Your password has been changed");
                                }
                            }
                        );
                    }
                })
            }
        })
})

app.put('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const fName = req.body.firstName;
    const lName = req.body.lastName;
    const address = req.body.address;
    const phone = req.body.phoneNumber;
    const dob = req.body.dob;
    const email = req.body.email;
    const bankAccount = req.body.bankAccount;
    const employee = await Employee.findById({ _id: `${id}` })
        .then((result) => {
            if (result.length == 0) {
                res.send("Employee Doesn't Exist")
            }
            else {
                Employee.findByIdAndUpdate(
                    { _id: `${id}` },
                    { $set: { firstName: fName, lastName: lName, address: address, phoneNumber: phone, dob: dob, email: email, bankAccountNumber: bankAccount } },
                    function (err, result) {
                        if (err) {
                            res.status(210).send(err);
                        } else {
                            console.log("Done");
                            res.status(200).send("Your details have been updated");
                        }
                    }
                );
            }
        })
})


app.put('/managerEditPass/:id', async (req, res) => {
    const { id } = req.params;
    const curPass = req.body.curPassword;
    const newPass = req.body.newPassword;
    const hashedNewPass = Bcrypt.hashSync(newPass, 10);
    const manager = await Manager.findById({ _id: `${id}` })
        .then((result) => {
            if (result.length == 0) {
                res.send("Manager Doesn't Exist")
            }
            else {
                const hash = result.password;
                Bcrypt.compare(curPass, hash, (err, result) => {
                    if (err) {
                        throw err;
                    }
                    else if (!result) {
                        console.log("Incorrect Current Password");
                        res.status(210).send("Incorrect Current Password. Retry");
                    }
                    else if (result) {
                        Manager.findByIdAndUpdate(
                            { _id: `${id}` },
                            { password: hashedNewPass },
                            function (err, result) {
                                if (err) {
                                    res.status(210).send(err);
                                } else {
                                    console.log("Done");
                                    res.status(200).send("Your password has been changed");
                                }
                            }
                        );
                    }
                })
            }
        })
})

app.put('/managerEdit/:id', async (req, res) => {
    const { id } = req.params;
    const fName = req.body.firstName;
    const lName = req.body.lastName;
    const address = req.body.address;
    const phone = req.body.phoneNumber;
    const dob = req.body.dob;
    const email = req.body.email;
    const bankAccount = req.body.bankAccount;
    const manager = await Manager.findById({ _id: `${id}` })
        .then((result) => {
            if (result.length == 0) {
                res.send("Manager Doesn't Exist")
            }
            else {
                Manager.findByIdAndUpdate(
                    { _id: `${id}` },
                    { $set: { firstName: fName, lastName: lName, address: address, phoneNumber: phone, dob: dob, email: email, bankAccountNumber: bankAccount } },
                    function (err, result) {
                        if (err) {
                            res.status(210).send(err);
                        } else {
                            console.log("Done");
                            res.status(200).send("Your details have been updated");
                        }
                    }
                );
            }
        })
})

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

    const schedule = await Schedule.findOneAndUpdate({ week: req.body.date }, { schedule: req.body.shifts }).then((result) => {
        res.status(200).send('Sucess')
    })
})

app.put('/approveReq', async function (req, res) {
    const schedule = await Timeoff.findOneAndUpdate({ name: req.body.name, date: req.body.date }, { approve: true }).then((result) => {
        res.status(200).send('Sucess')
    })
})

app.post('/denyReq', async function (req, res) {

    const schedule = await Timeoff.findOneAndRemove({ name: req.body.name, date: req.body.date }).then((result) => {
        res.status(200).send('Sucess')
    })
})

app.post('/createTimeoff', async function (req, res) {


    const name_from_id = await Employee.findById({ _id: req.body.id })

    const check = await Timeoff.find({ date: req.body.date }).then((result) => {
        if (result.length > 0) {
            console.log('existing')
            res.status(208).send('existing')
        }
        else {
            const time_off = new Timeoff({ name: name_from_id.firstName, date: req.body.date, approve: false })
            time_off.save().then((result_s) => {
                console.log("Added successfully")
                res.status(200).send('Sucess')
            }).catch((err) => {
                console.log(err)
            })
        }
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

function checkTimeoff(schedule, time_off) {

    let start_of_week = new Date(schedule.date)
    let day_req = new Date(time_off.date)

    console.log(start_of_week)
    console.log(day_req)

    if (!isSameWeek(start_of_week, day_req)) {
        return true
    }


    let names = time_off.name
    let day = getDay(day_req)


    for (let i = 0; i < schedule.shifts.length; i++) {
        if (schedule.shifts[i].name == names) {
            switch (day) {
                case 0:
                    if (schedule.shifts[i].sunday != "") {
                        return false
                    }
                case 1:
                    if (schedule.shifts[i].monday != "") {
                        return false
                    }
                case 2:
                    if (schedule.shifts[i].tuesday != "") {
                        return false
                    }
                case 3:
                    if (schedule.shifts[i].wednesday != "") {
                        return false
                    }
                case 4:
                    if (schedule.shifts[i].thursday != "") {
                        return false
                    }
                case 5:
                    if (schedule.shifts[i].friday != "") {
                        return false
                    }
                case 6:
                    if (schedule.shifts[i].saturday != "") {
                        return false
                    }
            }
        }
    }
    return true
}


app.post('/getEmployeeShifts/:id', async function (req, res) {

    const { id } = req.params;
    let day = req.body.date
    const employee_name = await Employee.findById({ _id: `${id}` }).select('firstName -_id');

    const schedule = await Schedule.find({ week: day }).then((result) => {
        if (result.length == 0) {
            console.log('No Schedule')
        }
        else {
            res.status(200).send({ shifts: result[0].schedule, name: employee_name });
        }
    }
    )
})

app.post('/createTransfer/:id', async function (req, res) {
    const { id } = req.params;
    const employee_name = await Employee.findById({ _id: `${id}` }).select('firstName -_id');

    let split_val_week = req.body.week.split(' ')

    let start_of_week = parseISO(split_val_week[0])

    let split_val_shift = req.body.shift.split(': ')


    let day_of_week = split_val_shift[0]
    let time_of_shift = split_val_shift[1]



    let flag = true
    if (time_of_shift == '' || time_of_shift == undefined) {
        res.status(208).send()
        flag = false
    }

    let proper_date = null

    switch (day_of_week) {
        case ("Sunday"):
            proper_date = addDays(start_of_week, 0)
            break
        case ("Monday"):
            proper_date = addDays(start_of_week, 1)
            break
        case ("Tuesday"):
            proper_date = addDays(start_of_week, 2)
            break
        case ("Wednesday"):
            proper_date = addDays(start_of_week, 3)
            break
        case ("Thursday"):
            proper_date = addDays(start_of_week, 4)
            break
        case ("Friday"):
            proper_date = addDays(start_of_week, 5)
            break
        case ("Saturday"):
            proper_date = addDays(start_of_week, 6)
            break
    }
    const new_transfer = new Shift({
        name: employee_name.firstName,
        date: proper_date,
        time: time_of_shift,
        status: req.body.status
    })

    if (flag == true) {
        new_transfer.save().then((result) => {
            res.status(200).send()
        })
    }
})


app.post('/createSwap/:id', async function (req, res) {
    const { id } = req.params;
    const employee_name = await Employee.findById({ _id: `${id}` }).select('firstName -_id');

    let split_val_week = req.body.week.split(' ')

    let start_of_week = parseISO(split_val_week[0])

    let split_val_shift = req.body.shift.split(': ')


    let day_of_week = split_val_shift[0]
    let time_of_shift = split_val_shift[1]



    let flag = true
    if (time_of_shift == '' || time_of_shift == undefined) {
        res.status(208).send()
        flag = false
    }

    let proper_date = null

    switch (day_of_week) {
        case ("Sunday"):
            proper_date = addDays(start_of_week, 0)
            break
        case ("Monday"):
            proper_date = addDays(start_of_week, 1)
            break
        case ("Tuesday"):
            proper_date = addDays(start_of_week, 2)
            break
        case ("Wednesday"):
            proper_date = addDays(start_of_week, 3)
            break
        case ("Thursday"):
            proper_date = addDays(start_of_week, 4)
            break
        case ("Friday"):
            proper_date = addDays(start_of_week, 5)
            break
        case ("Saturday"):
            proper_date = addDays(start_of_week, 6)
            break
    }
    const new_transfer = new Shift({
        name: employee_name.firstName,
        date: proper_date,
        time: time_of_shift,
        status: req.body.status
    })

    if (flag == true) {
        new_transfer.save().then((result) => {
            res.status(200).send()
        })
    }
})

app.listen(PORT, HOST);

console.log("Server running");