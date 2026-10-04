const Company = require('../models/Company');

/**
 * @desc    Get all companies
 * @route   GET /api/companies
 * @access  Private (Authenticated users)
 */
const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({ name: 1 });
    res.json(companies);
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Create a new company
 * @route   POST /api/companies
 * @access  Private (Officer only)
 */
const createCompany = async (req, res) => {
  try {
    const { name, location, description } = req.body;

    // Validate required fields
    if (!name || !location) {
      return res.status(400).json({ message: 'Company name and location are required' });
    }

    const company = await Company.create({ name, location, description });
    res.status(201).json(company);
  } catch (error) {
    console.error('Create company error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getCompanies, createCompany };
