const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema
 * 
 * This is a unified user model for all three roles:
 * - student: Has studentId, cgpa, and batch fields
 * - officer: The placement officer account
 * - management: The college management account
 * 
 * Key features:
 * - Password is hashed automatically before saving (using bcrypt)
 * - Password is never returned in queries (select: false)
 * - Username and studentId have unique constraints
 * - CGPA is validated to be between 0 and 10
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false  // Password will NOT be returned in queries by default
  },
  role: {
    type: String,
    enum: ['student', 'officer', 'management'],
    required: [true, 'Role is required']
  },

  // --- Student-specific fields ---
  studentId: {
    type: String,
    unique: true,
    sparse: true,  // Allows null for non-student users while keeping uniqueness for students
    trim: true
  },
  cgpa: {
    type: Number,
    min: [0, 'CGPA cannot be less than 0'],
    max: [10, 'CGPA cannot be more than 10']
  },
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch'  // Reference to the Batch model
  },

  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true  // Automatically adds createdAt and updatedAt
});

/**
 * Pre-save middleware - Hashes password before saving to database.
 * This runs every time a user document is saved.
 * It only hashes the password if it has been modified (not on every save).
 */
userSchema.pre('save', async function(next) {
  // Only hash if password was modified
  if (!this.isModified('password')) {
    return next();
  }
  
  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Instance method to compare entered password with the hashed password in DB.
 * Used during login to verify credentials.
 * 
 * @param {string} enteredPassword - The plain text password entered by the user
 * @returns {boolean} - true if passwords match, false otherwise
 */
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
