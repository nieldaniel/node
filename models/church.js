const mongoose = require('mongoose')

const Schema = mongoose.Schema

const churchSchema = new Schema({
  name: String,
  address: String,
  since: Number,
  congregations: Number, //congregations = jemaat
  createdAt: { type: Date, default: Date.now() },
  updatedAt: Date
})

module.exports = mongoose.model('church', churchSchema)
