const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    originChurch: String,
    email: { type: String, unique: true},
    password: String,
    phone: Number
})

module.exports = mongoose.model('user', userSchema)