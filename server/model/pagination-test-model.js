const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const pageinationTestSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    cover: { type: String, required: true }
})
// Biên dịch mô hình từ schema
module.exports = mongoose.model('paginationTest', pageinationTestSchema)