const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
    schedule: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "Shift",
        required: true
    },
    week: {
        type: String,
        required: true
    }
});

const Schedule = mongoose.model('Schedule', scheduleSchema);
module.exports = Schedule;

