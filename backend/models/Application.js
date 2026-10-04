const mongoose = require('mongoose');

/**
 * Application Schema
 * 
 * Represents a student's application to a placement drive.
 * 
 * Key relationships (Mongoose references):
 * - student → User model (the student who applied)
 * - drive → Drive model (the placement drive they applied to)
 * 
 * Important rules:
 * - A student can only apply ONCE to any given drive (enforced by compound unique index)
 * - Status can only be: Applied, Shortlisted, Rejected, Selected
 * - Only an officer can change the status
 * - Students can only view their application status
 */
const applicationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to User collection (student)
    required: [true, 'Student is required']
  },
  drive: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Drive',  // Reference to Drive collection
    required: [true, 'Drive is required']
  },
  status: {
    type: String,
    enum: ['Applied', 'Shortlisted', 'Rejected', 'Selected'],
    default: 'Applied'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

/**
 * Compound unique index on student + drive.
 * This ensures a student cannot apply to the same drive more than once.
 * MongoDB will reject any duplicate combination at the database level.
 */
applicationSchema.index({ student: 1, drive: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
