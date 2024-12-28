const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Patient', 'Doctor', 'Admin'], default: 'user', required: true },
  age: { type: Number, min: 6, max: 120 },
  location: {
    name: { type: String },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    }
  }
}, { timestamps: true })

const User = mongoose.model('User', UserSchema)
module.exports = { User }