const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'Sin verificar'
    }
    , activity: {
        type: Boolean,
        required: true,
        default: true
    },
    code:{
        type: String,
        required: false
    }

    
},{ timestamps: true });

module.exports = mongoose.model('User', userSchema, 'users');