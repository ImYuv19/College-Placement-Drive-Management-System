const Application = require('../models/Application');
const Drive = require('../models/Drive');
const User = require('../models/User');

/**
 * @desc    Apply for a placement drive
 * @route   POST /api/drives/:id/apply
 * @access  Private (Student only)
 * 
 * THIS IS ONE OF THE MOST IMPORTANT FEATURES — CGPA ELIGIBILITY CHECK
 * 
 * Steps:
 * 1. Verify the student is authenticated (done by authMiddleware)
 * 2. Verify the user's role is 'student' (done by roleMiddleware)
 * 3. Find the drive
 * 4. Check drive is active
 * 5. Get student's CGPA from the database
 * 6. Get drive's minCgpa
 * 7. Compare: student.cgpa >= drive.minCgpa
 * 8. If eligible: create application
 * 9. If not eligible: reject with clear error message
 * 10. Also check for duplicate applications
 */
const applyForDrive = async (req, res) => {
  try {
    const driveId = req.params.id;
    const studentId = req.user._id;

    // Step 1: Find the drive
    const drive = await Drive.findById(driveId).populate('company', 'name');
    if (!drive) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    // Step 2: Check if drive is active
    if (drive.status !== 'active') {
      return res.status(400).json({ message: 'This drive is no longer active' });
    }

    // Step 3: Get the student's details from database (NOT from request)
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(400).json({ message: 'Invalid student account' });
    }

    // Step 4: CGPA ELIGIBILITY CHECK — The core business logic
    // Compare the student's CGPA (from database) with the drive's minimum CGPA
    if (student.cgpa < drive.minCgpa) {
      // Student is NOT eligible — return clear error with details
      return res.status(400).json({
        message: 'You are not eligible for this placement drive.',
        requiredCgpa: drive.minCgpa,
        yourCgpa: student.cgpa
      });
    }

    // Step 5: Check for duplicate application (also enforced by DB unique index)
    const existingApplication = await Application.findOne({
      student: studentId,
      drive: driveId
    });

    if (existingApplication) {
      return res.status(409).json({ 
        message: 'You have already applied for this drive' 
      });
    }

    // Step 6: Student is eligible and hasn't applied before — create the application
    const application = await Application.create({
      student: studentId,
      drive: driveId,
      status: 'Applied'
    });

    // Populate details for the response
    const populatedApp = await Application.findById(application._id)
      .populate({
        path: 'drive',
        populate: { path: 'company', select: 'name location' }
      })
      .populate('student', 'name studentId');

    res.status(201).json({
      message: 'Application submitted successfully!',
      application: populatedApp
    });
  } catch (error) {
    // Handle the MongoDB duplicate key error (belt-and-suspenders with our manual check)
    if (error.code === 11000) {
      return res.status(409).json({ message: 'You have already applied for this drive' });
    }
    console.error('Apply error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get current student's applications
 * @route   GET /api/applications/my
 * @access  Private (Student only)
 */
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate({
        path: 'drive',
        populate: { path: 'company', select: 'name location' }
      })
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Get my applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get all applications for a specific drive
 * @route   GET /api/drives/:id/applications
 * @access  Private (Officer only)
 */
const getDriveApplications = async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.id);
    if (!drive) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    const applications = await Application.find({ drive: req.params.id })
      .populate('student', 'name studentId cgpa mobile batch')
      .populate({
        path: 'student',
        populate: { path: 'batch', select: 'name' }
      })
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Get drive applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Update application status
 * @route   PUT /api/applications/:id/status
 * @access  Private (Officer only)
 * 
 * Allowed statuses: Applied, Shortlisted, Rejected, Selected
 * Only the officer can change the status.
 */
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    const allowedStatuses = ['Applied', 'Shortlisted', 'Rejected', 'Selected'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`
      });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = status;
    await application.save();

    const updatedApp = await Application.findById(application._id)
      .populate('student', 'name studentId cgpa mobile')
      .populate({
        path: 'drive',
        populate: { path: 'company', select: 'name' }
      });

    res.json(updatedApp);
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { applyForDrive, getMyApplications, getDriveApplications, updateApplicationStatus };
