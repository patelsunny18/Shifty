const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema;

const managerSchema = new Schema({
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
    },
    sin: {
        type: Number,
        required: true,
        unique: true
    },
    ID: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    // discuss how to store availability
    // should manager have availability?
    availability: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
});

managerSchema.plugin(uniqueValidator)
const Manager = mongoose.model('Manager', managerSchema);
module.exports = Manager;