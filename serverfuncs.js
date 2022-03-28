'use strict';

const Employee = require('./models/employee');
const Manager = require('./models/manager');
const Owner = require('./models/owner');

const generator = require('generate-password');
const session = require('express-session');
const Bcrypt = require('bcryptjs');

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

function validateEmployeeId(id) {
    if (id.length === 6) {
        return true;
    } else {
        return false;
    }
}

function validateManagerId(id) {
    if (id.length === 7) {
        return true;
    } else {
        return false;
    }
}

function validateOwnerId(id) {
    if (id.length === 5) {
        return true;
    } else {
        return false;
    }
}

function validatePassword(password) {
    if (password.length >= 6) {
        return true;
    } else {
        return false;
    }
}

function checkEmployeeLogin(id, password) {
    return new Promise((resolve, reject) => {
        Employee.findOne({
            employeeID: id,
        }, (err, employee) => {
            if (err) {
                reject(err);
            } else if (employee) {
                const hash = employee.password;
                Bcrypt.compare(password, hash, (err, res) => {
                    if (res) {
                        resolve(employee);
                    } else {
                        reject('Wrong password');
                    }
                }
                );
            } else {
                reject('Employee not found');
            }
        });
    });
}

function checkManagerLogin(id, password) {
    return new Promise((resolve, reject) => {
        Manager.findOne({
            managerID: id,
        }, (err, manager) => {
            if (err) {
                reject(err);
            } else if (manager) {
                const hash = manager.password;
                Bcrypt.compare(password, hash, (err, result) => {
                    if (err) {
                        reject(err);
                    } else if (result) {
                        resolve(manager);
                    } else {
                        reject('Wrong password or id');
                    }
                });
            } else {
                reject('Manager not found');
            }
        });
    });
}


function checkOwnerLogin(id, password) {
    return new Promise((resolve, reject) => {
        Owner.findOne({
            ownerID: id,
            password: password
        }, (err, owner) => {
            if (err) {
                reject(err);
            } else if (owner) {
                if (owner.password === password) {
                    resolve(owner);
                } else {
                    reject('Wrong password or id');
                }
            } else {
                reject('Owner not found');
            }
        });
    });
}

exports = module.exports = {
    getEmployeeId, 
    getManagerId, 
    getPassword, 
    validateEmployeeId, 
    validateManagerId, 
    validateOwnerId, 
    validatePassword, 
    checkEmployeeLogin, 
    checkManagerLogin,
    checkOwnerLogin
}