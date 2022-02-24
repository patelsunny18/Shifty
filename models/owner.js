const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ownerSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        requiured: true
    },
    ownerID: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
});

const Owner = mongoose.model('Owner', ownerSchema);
module.exports = Owner;