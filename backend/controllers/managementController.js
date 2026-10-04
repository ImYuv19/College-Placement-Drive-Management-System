const User = require('../models/User');
const Batch = require('../models/Batch');
const bcrypt = require('bcryptjs');
const XLSX = require('xlsx');
const { validateCgpa } = require('../middleware/validationMiddleware');

// =============================================
// STUDENT MANAGEMENT
// =============================================

/**
 * @desc    Get all students
 * @route   GET /api/management/students
 * @access  Private (Management only)
 * 
 * Supports search by name, studentId, or username via query parameter.
 * Supports filter by batch via query parameter.
 */
const getStudents = async (req, res) => {
  try {
    let filter = { role: 'student' };

    // Search by name, studentId, or username
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { name: searchRegex },
        { studentId: searchRegex },
        { username: searchRegex }
      ];
    }

    // Filter by batch
    if (req.query.batch) {
      filter.batch = req.query.batch;
    }

    const students = await User.find(filter)
      .select('-password')
      .populate('batch', 'name isActive')
      .sort({ studentId: 1 });

    res.json(students);
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get a single student by ID
 * @route   GET /api/management/students/:id
 * @access  Private (Management only)
 */
const getStudentById = async (req, res) => {
  try {
    const student = await User.findOne({ _id: req.params.id, role: 'student' })
      .select('-password')
      .populate('batch', 'name isActive');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Update a student's information
 * @route   PUT /api/management/students/:id
 * @access  Private (Management only)
 * 
 * Management can update: name, username, mobile, password, cgpa, batch, isActive
 */
const updateStudent = async (req, res) => {
  try {
    const student = await User.findOne({ _id: req.params.id, role: 'student' })
      .select('+password');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const { name, username, mobile, password, cgpa, batch, isActive } = req.body;

    // Validate CGPA if being updated
    if (cgpa !== undefined) {
      const cgpaError = validateCgpa(Number(cgpa));
      if (cgpaError) {
        return res.status(400).json({ message: cgpaError });
      }
      student.cgpa = Number(cgpa);
    }

    // Check username uniqueness if being changed
    if (username && username !== student.username) {
      const usernameExists = await User.findOne({ username: username.toLowerCase() });
      if (usernameExists) {
        return res.status(409).json({ message: 'Username already taken' });
      }
      student.username = username.toLowerCase();
    }

    // Update fields if provided
    if (name) student.name = name;
    if (mobile) student.mobile = mobile;
    if (password) student.password = password; // Will be hashed by pre-save middleware
    if (batch) student.batch = batch;
    if (isActive !== undefined) student.isActive = isActive;

    await student.save();

    // Return updated student without password
    const updatedStudent = await User.findById(student._id)
      .select('-password')
      .populate('batch', 'name isActive');

    res.json(updatedStudent);
  } catch (error) {
    console.error('Update student error:', error);
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Username or Student ID already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Import students from CSV/XLSX file
 * @route   POST /api/management/students/import
 * @access  Private (Management only)
 * 
 * Expected columns: Student ID, Name, Mobile, Username, Password, CGPA, Batch
 * 
 * Process:
 * 1. Parse the uploaded file
 * 2. Validate each row
 * 3. Report errors for invalid rows
 * 4. Import valid rows
 * 5. Return import summary
 */
const importStudents = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file (CSV or XLSX)' });
    }

    // Parse the uploaded file using xlsx library
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet);

    if (rows.length === 0) {
      return res.status(400).json({ message: 'File is empty' });
    }

    const results = { success: 0, failed: 0, errors: [] };
    const validStudents = [];

    // First pass: validate all rows
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2; // +2 because row 1 is header, data starts at row 2
      const rowErrors = [];

      // Map column names (handle variations)
      const studentId = row['Student ID'] || row['studentId'] || row['StudentID'] || row['student_id'];
      const name = row['Name'] || row['name'];
      const mobile = row['Mobile'] || row['mobile'] || row['Phone'] || row['phone'];
      const username = row['Username'] || row['username'];
      const password = row['Password'] || row['password'];
      const cgpa = row['CGPA'] || row['cgpa'];
      const batchName = row['Batch'] || row['batch'];

      // Validate required fields
      if (!studentId) rowErrors.push('Missing Student ID');
      if (!name) rowErrors.push('Missing Name');
      if (!mobile) rowErrors.push('Missing Mobile');
      if (!username) rowErrors.push('Missing Username');
      if (!password) rowErrors.push('Missing Password');
      if (cgpa === undefined || cgpa === null || cgpa === '') rowErrors.push('Missing CGPA');
      if (!batchName) rowErrors.push('Missing Batch');

      // Validate CGPA range
      if (cgpa !== undefined && cgpa !== null && cgpa !== '') {
        const numCgpa = Number(cgpa);
        if (isNaN(numCgpa) || numCgpa < 0 || numCgpa > 10) {
          rowErrors.push('Invalid CGPA (must be 0-10)');
        }
      }

      if (rowErrors.length > 0) {
        results.errors.push({ row: rowNum, errors: rowErrors });
        results.failed++;
      } else {
        validStudents.push({
          studentId: String(studentId).trim(),
          name: String(name).trim(),
          mobile: String(mobile).trim(),
          username: String(username).trim().toLowerCase(),
          password: String(password),
          cgpa: Number(cgpa),
          batchName: String(batchName).trim()
        });
      }
    }

    // Second pass: check for duplicates within the file and against database
    const seenStudentIds = new Set();
    const seenUsernames = new Set();
    const finalValidStudents = [];

    for (const student of validStudents) {
      const rowNum = rows.findIndex(r => 
        (r['Student ID'] || r['studentId'] || r['StudentID'] || r['student_id']) == student.studentId
      ) + 2;

      if (seenStudentIds.has(student.studentId)) {
        results.errors.push({ row: rowNum, errors: ['Duplicate Student ID in file'] });
        results.failed++;
        continue;
      }
      if (seenUsernames.has(student.username)) {
        results.errors.push({ row: rowNum, errors: ['Duplicate Username in file'] });
        results.failed++;
        continue;
      }

      // Check against database
      const existingById = await User.findOne({ studentId: student.studentId });
      const existingByUsername = await User.findOne({ username: student.username });

      if (existingById) {
        results.errors.push({ row: rowNum, errors: ['Student ID already exists in database'] });
        results.failed++;
        continue;
      }
      if (existingByUsername) {
        results.errors.push({ row: rowNum, errors: ['Username already exists in database'] });
        results.failed++;
        continue;
      }

      seenStudentIds.add(student.studentId);
      seenUsernames.add(student.username);
      finalValidStudents.push(student);
    }

    // Third pass: create valid student accounts
    for (const student of finalValidStudents) {
      try {
        // Find or create batch
        let batch = await Batch.findOne({ name: student.batchName });
        if (!batch) {
          batch = await Batch.create({ name: student.batchName, isActive: false });
        }

        await User.create({
          name: student.name,
          username: student.username,
          mobile: student.mobile,
          password: student.password,
          role: 'student',
          studentId: student.studentId,
          cgpa: student.cgpa,
          batch: batch._id,
          isActive: true
        });

        results.success++;
      } catch (err) {
        const rowNum = rows.findIndex(r =>
          (r['Student ID'] || r['studentId'] || r['StudentID'] || r['student_id']) == student.studentId
        ) + 2;
        results.errors.push({ row: rowNum, errors: [err.message] });
        results.failed++;
      }
    }

    res.json({
      message: `Import complete. Successfully imported: ${results.success}. Failed: ${results.failed}`,
      success: results.success,
      failed: results.failed,
      errors: results.errors
    });
  } catch (error) {
    console.error('Import students error:', error);
    res.status(500).json({ message: 'Server error during import' });
  }
};

// =============================================
// BATCH MANAGEMENT
// =============================================

/**
 * @desc    Get all batches
 * @route   GET /api/management/batches
 * @access  Private (Management only)
 */
const getBatches = async (req, res) => {
  try {
    const batches = await Batch.find().sort({ createdAt: -1 });
    
    // Get student count for each batch
    const batchesWithCount = await Promise.all(
      batches.map(async (batch) => {
        const studentCount = await User.countDocuments({ batch: batch._id, role: 'student' });
        return {
          ...batch.toObject(),
          studentCount
        };
      })
    );

    res.json(batchesWithCount);
  } catch (error) {
    console.error('Get batches error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Create a new batch
 * @route   POST /api/management/batches
 * @access  Private (Management only)
 */
const createBatch = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Batch name is required' });
    }

    // Check if batch name already exists
    const existingBatch = await Batch.findOne({ name });
    if (existingBatch) {
      return res.status(409).json({ message: 'Batch name already exists' });
    }

    const batch = await Batch.create({ name, isActive: false });
    res.status(201).json(batch);
  } catch (error) {
    console.error('Create batch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Activate a batch (deactivates all others)
 * @route   PUT /api/management/batches/:id/activate
 * @access  Private (Management only)
 * 
 * When a new batch is activated:
 * 1. All currently active batches are deactivated
 * 2. The specified batch is activated
 * 3. Old batches are NOT deleted (historical records depend on them)
 */
const activateBatch = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    // Deactivate all batches first
    await Batch.updateMany({}, { isActive: false });

    // Activate the selected batch
    batch.isActive = true;
    await batch.save();

    res.json({ message: `Batch '${batch.name}' is now active`, batch });
  } catch (error) {
    console.error('Activate batch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// =============================================
// OFFICER ACCOUNT MANAGEMENT
// =============================================

/**
 * @desc    Update placement officer account
 * @route   PUT /api/management/officer
 * @access  Private (Management only)
 * 
 * Management can update the officer's name, username, mobile, and password.
 */
const updateOfficer = async (req, res) => {
  try {
    const officer = await User.findOne({ role: 'officer' }).select('+password');

    if (!officer) {
      return res.status(404).json({ message: 'Placement officer account not found' });
    }

    const { name, username, mobile, password } = req.body;

    // Check username uniqueness if changed
    if (username && username !== officer.username) {
      const usernameExists = await User.findOne({ username: username.toLowerCase() });
      if (usernameExists) {
        return res.status(409).json({ message: 'Username already taken' });
      }
      officer.username = username.toLowerCase();
    }

    if (name) officer.name = name;
    if (mobile) officer.mobile = mobile;
    if (password) officer.password = password; // Will be hashed by pre-save middleware

    await officer.save();

    // Return without password
    const updatedOfficer = await User.findById(officer._id).select('-password');
    res.json(updatedOfficer);
  } catch (error) {
    console.error('Update officer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// =============================================
// MANAGEMENT ACCOUNT (SELF)
// =============================================

/**
 * @desc    Update management's own account
 * @route   PUT /api/management/account
 * @access  Private (Management only)
 */
const updateManagementAccount = async (req, res) => {
  try {
    const management = await User.findById(req.user._id).select('+password');

    if (!management) {
      return res.status(404).json({ message: 'Account not found' });
    }

    const { name, username, mobile, password } = req.body;

    // Check username uniqueness if changed
    if (username && username !== management.username) {
      const usernameExists = await User.findOne({ username: username.toLowerCase() });
      if (usernameExists) {
        return res.status(409).json({ message: 'Username already taken' });
      }
      management.username = username.toLowerCase();
    }

    if (name) management.name = name;
    if (mobile) management.mobile = mobile;
    if (password) management.password = password; // Will be hashed by pre-save middleware

    await management.save();

    // Return without password
    const updatedManagement = await User.findById(management._id).select('-password');
    res.json(updatedManagement);
  } catch (error) {
    console.error('Update management account error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getStudents,
  getStudentById,
  updateStudent,
  importStudents,
  getBatches,
  createBatch,
  activateBatch,
  updateOfficer,
  updateManagementAccount
};
