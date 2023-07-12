const mongoose = require('mongoose')
const { Schema } = mongoose

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true }
}, { versionKey: false })

module.exports = mongoose.model('User', UserSchema)
