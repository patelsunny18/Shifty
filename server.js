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
const { addDays, parseISO, add, getDay } = require('date-fns');

// make webpage availible
const PORT = 8080;
const HOST = '0.0.0.0';
const app = express();


// importing the user models
const Employee = require('./models/employee');
const Manager = require('./models/manager');
const Owner = require('./models/owner');
const Shift = require('./models/shift');
const Schedule = require('./models/schedule');
const Timeoff = require('./models/timeoff');

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

    // get the first and second week from the current date
    const currDate = new Date();
    const startOfWeek1 = startOfWeek(addDays(currDate, 7));
    const endOfWeek1 = endOfWeek(addDays(currDate, 7));
    let firstWeek = format(startOfWeek1, "yyyy-MM-dd") + " to " + format(endOfWeek1, "yyyy-MM-dd");

    let startOfWeek2 = startOfWeek(addDays(currDate, 14));
    let endOfWeek2 = endOfWeek(addDays(currDate, 14));
    let secondWeek = format(startOfWeek2, "yyyy-MM-dd") + " to " + format(endOfWeek2, "yyyy-MM-dd");

    let firstWeekDates = [
        format(addDays(currDate, 2), "do MMMM"),
        format(addDays(currDate, 3), "do MMMM"),
        format(addDays(currDate, 4), "do MMMM"),
        format(addDays(currDate, 5), "do MMMM"),
        format(addDays(currDate, 6), "do MMMM"),
        format(addDays(currDate, 7), "do MMMM"),
        format(addDays(currDate, 8), "do MMMM"),
    ];

    let secondWeekDates = [
        format(addDays(currDate, 9), "do MMMM"),
        format(addDays(currDate, 10), "do MMMM"),
        format(addDays(currDate, 11), "do MMMM"),
        format(addDays(currDate, 12), "do MMMM"),
        format(addDays(currDate, 13), "do MMMM"),
        format(addDays(currDate, 14), "do MMMM"),
        format(addDays(currDate, 15), "do MMMM"),
    ];

    let nameList = [];
    let employees = null;
    try {
        employees = await Employee.find({});
    } catch (error) {
        res.redirect('/error');
    }

    if (employees) {
        employees.forEach(employee => {
            nameList.push(`${employee.firstName} ${employee.lastName}`);
        });
    }

    // if found
    if (owner) {
        res.render('ownerCreateSchedule', {
            id: id,
            firstWeek: firstWeek,
            secondWeek: secondWeek,
            nameList: nameList,
            firstWeekDates: firstWeekDates,
            secondWeekDates: secondWeekDates
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

// GET route to changeAvailability for Employee
app.get('/employee/edit/:id', isEmployee, async (req, res) => {
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

    // if found
    if (employee) {
        res.render('availableShifts', {
            id: id
        });
    }
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

app.post('/addToSchedule', async (req, res) => {
    const data = req.body;
    const name = data.employee;
    const [firstName, lastName] = name.split(' ');
    const [weekStart, weekEnd] = data.week.split(' to ');
    const first_date_of_week = startOfWeek(parseISO(weekStart));

    let employee = null;
    try {
        employee = await Employee.findOne({ firstName: firstName, lastName: lastName });
    } catch (error) {
        console.log(error);
    }

    Shift.find({ employee: employee._id, week: data.week }, async (err, docs) => {
        if (docs.length) {
            console.log("employee is already scheduled");
            res.status(409).send("employee is already scheduled");
        } else {
            for (const [key, value] of Object.entries(data)) {
                if (key === 'sunday') {
                    const newShift = new Shift({
                        employee: employee._id,
                        date: addDays(first_date_of_week, 0),
                        startTime: data.sunday[0],
                        endTime: data.sunday[1],
                        status: "confirmed",
                        week: data.week
                    });
                    newShift.save((err) => {
                        if (err) throw "cannot add sunday";
                    });
                } else if (key === 'monday') {
                    const newShift = new Shift({
                        employee: employee._id,
                        date: addDays(first_date_of_week, 1),
                        startTime: data.monday[0],
                        endTime: data.monday[1],
                        status: "confirmed",
                        week: data.week
                    });
                    newShift.save((err) => {
                        if (err) throw "cannot add monday";
                    });
                } else if (key === 'tuesday') {
                    const newShift = new Shift({
                        employee: employee._id,
                        date: addDays(first_date_of_week, 2),
                        startTime: data.tuesday[0],
                        endTime: data.tuesday[1],
                        status: "confirmed",
                        week: data.week
                    });
                    newShift.save((err) => {
                        if (err) throw "cannot add tuesday";
                    });
                } else if (key === 'wednesday') {
                    const newShift = new Shift({
                        employee: employee._id,
                        date: addDays(first_date_of_week, 3),
                        startTime: data.wednesday[0],
                        endTime: data.wednesday[1],
                        status: "confirmed",
                        week: data.week
                    });
                    newShift.save((err) => {
                        if (err) throw "cannot add wednesday";
                    });
                } else if (key === 'thursday') {
                    const newShift = new Shift({
                        employee: employee._id,
                        date: addDays(first_date_of_week, 4),
                        startTime: data.thursday[0],
                        endTime: data.thursday[1],
                        status: "confirmed",
                        week: data.week
                    });
                    newShift.save((err) => {
                        if (err) throw "cannot add thursday";
                    });
                } else if (key === 'friday') {
                    const newShift = new Shift({
                        employee: employee._id,
                        date: addDays(first_date_of_week, 5),
                        startTime: data.friday[0],
                        endTime: data.friday[1],
                        status: "confirmed",
                        week: data.week
                    });
                    newShift.save((err) => {
                        if (err) throw err;
                    });
                } else if (key === 'saturday') {
                    const newShift = new Shift({
                        employee: employee._id,
                        date: addDays(first_date_of_week, 6),
                        startTime: data.saturday[0],
                        endTime: data.saturday[1],
                        status: "confirmed",
                        week: data.week
                    });
                    newShift.save((err) => {
                        if (err) throw "cannot add saturday";
                    });
                }
            }
            res.status(200).send("Shifts added");
        }
    });
});

app.post('/getSchedule', async function (req, res) {
    const name = req.body.employee;
    const week = req.body.week;
    const [firstName, lastName] = name.split(' ');

    let employee = null;
    try {
        employee = await Employee.findOne({ firstName: firstName, lastName: lastName });
    } catch (error) {
        console.log(error);
    }

    let shifts = null;
    try {
        shifts = await Shift.find({ employee: employee._id, week: week }).populate('employee', "firstName lastName");
    } catch (error) {
        console.log(error);
    }

    if (shifts) {
        let data = {
            name: `${firstName} ${lastName}`,
            week: week,
        }

        shifts.forEach(shift => {
            const day = format(shift.date, "EEEE");
            data[`${day}`] = [shift.startTime, shift.endTime];
        });
        res.send(data);
    }
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

app.get('/getAvailability/:name', async (req, res) => {
    const firstName = req.params.name;
    let employee = null;

    try {
        employee = await Employee.findOne({ firstName: firstName });
    } catch (error) {
        res.redirect('/error');
    }

    if (employee) {
        res.send(employee.availability);
    }
});

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

app.listen(PORT, HOST);

console.log("Server running");