const mongoose = require('mongoose');
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
    managerID: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    // discuss how to store availability
    // should manager have availability?
    availability: {
        type: [String],
        required: true
    }
});

const Manager = mongoose.model('Manager', managerSchema);
module.exports = Manager;