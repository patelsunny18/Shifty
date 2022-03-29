const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shiftSchema = new Schema({
    sender: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Employee",
        required: true
    },
    recipient: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Employee"
    },
    date: {
        type: String,
        required: true
    },
    time:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true,
        default: "confirmed"
    }
});

const Shift = mongoose.model('Shift', shiftSchema);
module.exports = Shift;

