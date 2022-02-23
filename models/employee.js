const mongoose = require('mongoose');
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
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    bankAccountNumber: {
        type: Number,
        required: true
    },
    sin: {
        type: Number,
        required: true
    },
    employeeID: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    // discuss how to store availability
    availability: {
        type: [String],
        required: true
    },
    wage: {
        type: Number,
        required: true
    }
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;