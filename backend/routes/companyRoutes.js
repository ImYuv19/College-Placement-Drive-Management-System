const express = require('express');
const router = express.Router();
const { getCompanies, createCompany } = require('../controllers/companyController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// GET /api/companies — Authenticated users
router.get('/', protect, getCompanies);

// POST /api/companies — Officer only
router.post('/', protect, authorize('officer'), createCompany);

module.exports = router;
