const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getStudents,
  getStudentById,
  updateStudent,
  importStudents,
  getBatches,
  createBatch,
  activateBatch,
  updateOfficer,
  updateManagementAccount
} = require('../controllers/managementController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validateObjectId } = require('../middleware/validationMiddleware');

// Multer configuration for file uploads (stores in memory for processing)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Accept CSV and XLSX files
    const allowedTypes = [
      'text/csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    if (allowedTypes.includes(file.mimetype) || 
        file.originalname.endsWith('.csv') || 
        file.originalname.endsWith('.xlsx')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV and XLSX files are allowed'), false);
    }
  }
});

// All management routes require authentication + management role
router.use(protect, authorize('management'));

// ---- Student Management ----
router.get('/students', getStudents);
router.get('/students/:id', validateObjectId('id'), getStudentById);
router.put('/students/:id', validateObjectId('id'), updateStudent);
router.post('/students/import', upload.single('file'), importStudents);

// ---- Batch Management ----
router.get('/batches', getBatches);
router.post('/batches', createBatch);
router.put('/batches/:id/activate', validateObjectId('id'), activateBatch);

// ---- Officer Account ----
router.put('/officer', updateOfficer);

// ---- Management Account (Self) ----
router.put('/account', updateManagementAccount);

module.exports = router;
