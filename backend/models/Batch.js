const mongoose = require('mongoose');

/**
 * Batch Schema
 * 
 * Represents an academic batch/year group (e.g., "2025-26", "2026-27").
 * 
 * Important rules:
 * - Only ONE batch should be active at a time
 * - Old batches should NOT be deleted (historical records depend on them)
 * - When a new batch is activated, the previous active batch is deactivated
 * - isActive flag determines the current batch
 */
const batchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Batch name is required'],
    unique: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Batch', batchSchema);
