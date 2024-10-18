const mongoose = require('mongoose');  
const Schema = mongoose.Schema;

const activitySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    idUser: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema, 'activities');