const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
var schema = new mongoose.Schema({
    accountId: {
        type: String,
    },
    fullname: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    sdt: {
        type: String,
        required: false,
    },
    birthDay: {
        type: String,
        required: false,
    },
    createTime: {
        type: String,
        required: true,
    },
    updateTime: {
        type: String,
        required: false,
    },
    gender: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    // listInvoice: [{ type: ObjectId }]
});
const Users = mongoose.model('users', schema);
module.exports = Users;