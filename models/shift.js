const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shiftSchema = new Schema({
    name: {
        type: String,
        required: true
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

