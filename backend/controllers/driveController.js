const Drive = require('../models/Drive');
const Company = require('../models/Company');
const Application = require('../models/Application');
const { validateCgpa } = require('../middleware/validationMiddleware');

/**
 * @desc    Create a new placement drive
 * @route   POST /api/drives
 * @access  Private (Officer only)
 * 
 * The placementOfficer field is set from the JWT token (req.user._id),
 * NOT from the frontend request body. This prevents spoofing.
 */
const createDrive = async (req, res) => {
  try {
    const { company, role, minCgpa, description, driveDate } = req.body;

    // Validate required fields
    if (!company || !role || minCgpa === undefined || !driveDate) {
      return res.status(400).json({ 
        message: 'Company, role, minimum CGPA, and drive date are required' 
      });
    }

    // Validate CGPA range
    const cgpaError = validateCgpa(Number(minCgpa));
    if (cgpaError) {
      return res.status(400).json({ message: cgpaError });
    }

    // Verify company exists
    const companyExists = await Company.findById(company);
    if (!companyExists) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Create drive with officer ID from JWT token
    const drive = await Drive.create({
      company,
      role,
      minCgpa: Number(minCgpa),
      description,
      driveDate,
      placementOfficer: req.user._id  // Officer ID from authenticated JWT
    });

    // Populate company details before sending response
    const populatedDrive = await Drive.findById(drive._id)
      .populate('company', 'name location')
      .populate('placementOfficer', 'name');

    res.status(201).json(populatedDrive);
  } catch (error) {
    console.error('Create drive error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get all placement drives
 * @route   GET /api/drives
 * @access  Private (Student / Officer / Management)
 * 
 * For students: Returns only active drives by default.
 * For officers/management: Returns all drives.
 * Supports optional status filter via query parameter.
 */
const getDrives = async (req, res) => {
  try {
    let filter = {};

    // Students should only see active drives
    if (req.user.role === 'student') {
      filter.status = 'active';
    }

    // Allow status filter via query parameter
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const drives = await Drive.find(filter)
      .populate('company', 'name location description')
      .populate('placementOfficer', 'name')
      .sort({ driveDate: -1 });

    res.json(drives);
  } catch (error) {
    console.error('Get drives error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get a single drive by ID
 * @route   GET /api/drives/:id
 * @access  Private (Student / Officer / Management)
 */
const getDriveById = async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.id)
      .populate('company', 'name location description')
      .populate('placementOfficer', 'name');

    if (!drive) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    res.json(drive);
  } catch (error) {
    console.error('Get drive error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Update a placement drive
 * @route   PUT /api/drives/:id
 * @access  Private (Officer only)
 */
const updateDrive = async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.id);

    if (!drive) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    // Validate CGPA if being updated
    if (req.body.minCgpa !== undefined) {
      const cgpaError = validateCgpa(Number(req.body.minCgpa));
      if (cgpaError) {
        return res.status(400).json({ message: cgpaError });
      }
      req.body.minCgpa = Number(req.body.minCgpa);
    }

    // Verify company exists if being updated
    if (req.body.company) {
      const companyExists = await Company.findById(req.body.company);
      if (!companyExists) {
        return res.status(404).json({ message: 'Company not found' });
      }
    }

    // Update the drive
    const updatedDrive = await Drive.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('company', 'name location description')
      .populate('placementOfficer', 'name');

    res.json(updatedDrive);
  } catch (error) {
    console.error('Update drive error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Delete/Close a placement drive
 * @route   DELETE /api/drives/:id
 * @access  Private (Officer only)
 * 
 * If the drive has applications, it is CLOSED instead of deleted
 * to preserve historical data. If no applications exist, it is deleted.
 */
const deleteDrive = async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.id);

    if (!drive) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    // Check if drive has any applications
    const applicationCount = await Application.countDocuments({ drive: drive._id });

    if (applicationCount > 0) {
      // Close instead of delete to preserve historical records
      drive.status = 'closed';
      await drive.save();
      return res.json({ 
        message: 'Drive has been closed (not deleted) because it has existing applications.',
        drive 
      });
    }

    // No applications, safe to delete
    await Drive.findByIdAndDelete(req.params.id);
    res.json({ message: 'Drive deleted successfully' });
  } catch (error) {
    console.error('Delete drive error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createDrive, getDrives, getDriveById, updateDrive, deleteDrive };
