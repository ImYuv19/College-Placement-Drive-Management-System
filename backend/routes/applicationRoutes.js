const express = require('express');
const router = express.Router();
const { getMyApplications, updateApplicationStatus } = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validateObjectId } = require('../middleware/validationMiddleware');

// GET /api/applications/my — Student only
router.get('/my', protect, authorize('student'), getMyApplications);

// PUT /api/applications/:id/status — Officer only
router.put('/:id/status', protect, authorize('officer'), validateObjectId('id'), updateApplicationStatus);

module.exports = router;
