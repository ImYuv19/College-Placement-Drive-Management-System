const express = require('express');
const router = express.Router();
const { createDrive, getDrives, getDriveById, updateDrive, deleteDrive } = require('../controllers/driveController');
const { applyForDrive, getDriveApplications } = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validateObjectId } = require('../middleware/validationMiddleware');

// GET /api/drives — Student / Officer / Management
router.get('/', protect, getDrives);

// POST /api/drives — Officer only
router.post('/', protect, authorize('officer'), createDrive);

// GET /api/drives/:id — Student / Officer / Management
router.get('/:id', protect, validateObjectId('id'), getDriveById);

// PUT /api/drives/:id — Officer only
router.put('/:id', protect, authorize('officer'), validateObjectId('id'), updateDrive);

// DELETE /api/drives/:id — Officer only
router.delete('/:id', protect, authorize('officer'), validateObjectId('id'), deleteDrive);

// POST /api/drives/:id/apply — Student only (with CGPA eligibility check)
router.post('/:id/apply', protect, authorize('student'), validateObjectId('id'), applyForDrive);

// GET /api/drives/:id/applications — Officer only
router.get('/:id/applications', protect, authorize('officer'), validateObjectId('id'), getDriveApplications);

module.exports = router;
