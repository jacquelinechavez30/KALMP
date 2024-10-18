const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    day: {
        type: String,
        require: true
    },
    hour: {
        type: String,
        required: true
    },
    idUser: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Schedule', scheduleSchema, 'schedules');