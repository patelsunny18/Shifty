const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const timeoffSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    approve:{
        type: Boolean,
        required: true
    }
});

const Timeoff = mongoose.model('Timeoff', timeoffSchema);
module.exports = Timeoff;

