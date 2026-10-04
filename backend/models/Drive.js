const mongoose = require('mongoose');

/**
 * Drive Schema
 * 
 * Represents a placement drive conducted by a company.
 * 
 * Key relationships (Mongoose references):
 * - company → Company model (which company is conducting this drive)
 * - placementOfficer → User model (which officer created/manages this drive)
 * 
 * Important fields:
 * - minCgpa: The minimum CGPA required for a student to be eligible to apply
 * - status: 'active' means students can apply, 'closed' means drive is over
 */
const driveSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',  // Reference to Company collection
    required: [true, 'Company is required']
  },
  role: {
    type: String,
    required: [true, 'Job role is required'],
    trim: true
  },
  minCgpa: {
    type: Number,
    required: [true, 'Minimum CGPA is required'],
    min: [0, 'Minimum CGPA cannot be less than 0'],
    max: [10, 'Minimum CGPA cannot be more than 10']
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  driveDate: {
    type: Date,
    required: [true, 'Drive date is required']
  },
  placementOfficer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to User collection (officer who created the drive)
    required: [true, 'Placement officer is required']
  },
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Drive', driveSchema);
