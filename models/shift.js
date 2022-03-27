const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shiftSchema = new Schema({
    employee: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Employee",
        required: true,
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: "Confirmed"
    },
    week: {
        type: String,
        required: true
    }
});

const Shift = mongoose.model('Shift', shiftSchema);
module.exports = Shift;