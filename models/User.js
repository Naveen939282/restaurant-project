// =====================================================
// USER MODEL - MongoDB Schema
// =====================================================

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema Definition
const userSchema = new mongoose.Schema({
  // User's full name
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },

  // User's email address (unique)
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },

  // User's password (hashed)
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password in queries by default
  },

  // User's phone number
  phone: {
    type: String,
    trim: true,
    maxlength: [15, 'Phone number is too long']
  },

  // User's delivery address
  address: {
    type: String,
    trim: true
  },

  // User role: 'user' for customers, 'admin' for restaurant owner
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },

  // Account creation timestamp
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// =====================================================
// MIDDLEWARE: Hash password before saving
// =====================================================
userSchema.pre('save', async function(next) {
  // Only hash the password if it's modified
  if (!this.isModified('password')) {
    return next();
  }

  // Generate salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// =====================================================
// METHOD: Compare entered password with hashed password
// =====================================================
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// =====================================================
// METHOD: Get JWT token for authentication
// =====================================================
userSchema.methods.getSignedJwtToken = function() {
  const jwt = require('jsonwebtoken');
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// Export User model
module.exports = mongoose.model('User', userSchema);

