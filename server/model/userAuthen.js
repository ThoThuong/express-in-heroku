const mongoose = require('mongoose');
var schema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    permissionLevel: {
        type: Number,
    }
});
const UserAuthens = mongoose.model('userAuthens', schema);
module.exports = UserAuthens;
