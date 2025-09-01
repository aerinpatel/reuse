const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    // required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    // required: [true, 'Password is required'],
    // minlength: [6, 'Password must be at least 6 characters long']
  }
});

// Mongoose pre-save hook to hash the password before saving
// userSchema.pre('save', async function(next) {
//   // Only run this function if password was actually modified
//   if (!this.isModified('password')) return next();

//   // Hash the password with a salt of 12
//   const salt = await bcrypt.genSalt(12);
// //   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// Method to compare passwords
// userSchema.methods.comparePassword = async function(candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

const User = mongoose.model('User', userSchema);
module.exports = User;