const mongoose = require('mongoose');
const { Schema } = mongoose;


const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        minLength: [6, "password should be six digits"]
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('user', userSchema)