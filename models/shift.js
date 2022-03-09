const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShiftSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    Sunday : {
        type: String,
        required: true
    },
    Monday: {
        type: String,
        required: true
    },
    Tuesday: {
        type: String,
        required: true
    },
    Wednesday: {
        type: String,
        required: true
    },
    Thursday: {
        type: String,
        required: true
    },
    Friday: {
        type: String,
        required: true
    },
    Saturday: {
        type: String,
        required: true
    }
});

const Shift = mongoose.model('Shift', ShiftSchema);
module.exports = Shift;

