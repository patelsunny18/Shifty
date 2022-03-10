const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
    schedule: {
        type: Object,
        required: true
    },
    week_number: {
        type: Number,
        required: true
    }
});

const Schedule = mongoose.model('Schedule', scheduleSchema);
module.exports = Schedule;

