const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        requiured: true
    },
    address: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true,
        unique: true
    },
    dob: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    bankAccountNumber: {
        type: Number,
        required: true,
        unique: true
    },
    sin: {
        type: Number,
        required: true,
        unique: true
    },
    employeeID: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    // discuss how to store availability
    availability: {
        type: String,
        required: true
    },
    wage: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        required: true
    }
});

employeeSchema.plugin(uniqueValidator)
const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;