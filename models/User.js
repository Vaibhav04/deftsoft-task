const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  // Or we can also create a seprate collection for maintaining these tokens 
  resetPasswordToken: {
    type: String,
    required: false
  },
  resetPasswordExpires: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('User', userSchema);
