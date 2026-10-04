const mongoose = require('mongoose');

/**
 * Company Schema
 * 
 * Represents a company that conducts placement drives.
 * A company can have multiple placement drives associated with it.
 * Companies are created by the Placement Officer.
 */
const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Company location is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true  // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('Company', companySchema);
