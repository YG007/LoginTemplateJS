// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  role: {
      type: String,
      enum: ['admin', 'user', 'guest'], // Define your roles here
      default: 'user' // Default role is 'user'
  }

});

module.exports = mongoose.model('User', UserSchema);