const mongoose = require('mongoose');
const { createIndexes } = require('../model/user');
// MONGO_URI=mongodb+srv://TranNgocThuong:TranNgocThuong29111999@cluster0.cbe9i.mongodb.net/db_test_invoice?retryWrites=true&w=majority
const connectDB = async () => {
    try {

        const con = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });
        console.log(`MongoDB connected => ${con.connection.host}`);
    } catch (error) {
        console.log(`login fail -----=> ${error}`);
        process.exit(1);
    }
}
module.exports = connectDB;