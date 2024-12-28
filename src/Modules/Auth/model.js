const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'doctor', 'admin'], default: 'user', required: true },
  age: { type: Number, min: 6, max: 120 },
  location: {
    city: { type: String },
    country: { type: String },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    },
    place_id: { type: Number },
    osm_type: { type: String },
    osm_id: { type: Number },
    boundingbox: [String]
  }
}, { timestamps: true })

const User = mongoose.model('User', UserSchema)
module.exports = { User }