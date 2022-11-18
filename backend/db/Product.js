const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({
    name:String,
    price:String,
    category:String,
    userid:String,
    company:String,
})

//users : table name
module.exports = mongoose.model("products",productSchema);