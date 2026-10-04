const mongoose = require('mongoose');

/**
 * Validation Middleware
 * 
 * Contains reusable validation functions for common checks:
 * - MongoDB ObjectId validation
 * - CGPA range validation
 * - Required fields check
 * 
 * These help keep controllers clean by moving validation logic here.
 */

/**
 * Validates that a given string is a valid MongoDB ObjectId.
 * Used to prevent database errors when an invalid ID is passed in URL params.
 * 
 * Usage: router.get('/drives/:id', validateObjectId('id'), getDrive);
 */
const validateObjectId = (paramName) => {
  return (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params[paramName])) {
      return res.status(400).json({ message: `Invalid ${paramName} format` });
    }
    next();
  };
};

/**
 * Validates that CGPA is a number between 0 and 10.
 * Used when creating/updating drives or student records.
 */
const validateCgpa = (cgpa) => {
  if (cgpa === undefined || cgpa === null) return 'CGPA is required';
  if (typeof cgpa !== 'number' || isNaN(cgpa)) return 'CGPA must be a number';
  if (cgpa < 0 || cgpa > 10) return 'CGPA must be between 0 and 10';
  return null;
};

/**
 * Checks that all required fields are present in the request body.
 * Returns a list of missing field names.
 */
const checkRequiredFields = (body, fields) => {
  const missing = [];
  fields.forEach(field => {
    if (body[field] === undefined || body[field] === null || body[field] === '') {
      missing.push(field);
    }
  });
  return missing;
};

module.exports = { validateObjectId, validateCgpa, checkRequiredFields };
