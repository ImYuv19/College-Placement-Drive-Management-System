const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Generate JWT Token
 * 
 * Creates a JSON Web Token containing the user's ID and role.
 * The token expires in 7 days.
 * This token is sent to the client after successful login
 * and must be included in subsequent requests for authentication.
 */
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

/**
 * @desc    Login user (Student / Officer / Management)
 * @route   POST /api/auth/login
 * @access  Public
 * 
 * This is the SINGLE login endpoint for all three roles.
 * The frontend sends username and password.
 * The backend determines the user's role from the DATABASE, not from the request.
 */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide username and password' });
    }

    // Find user by username and explicitly include password field
    // (password has select: false in schema, so we need +password)
    const user = await User.findOne({ username: username.toLowerCase() })
      .select('+password')
      .populate('batch', 'name isActive');

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is disabled. Contact college management.' });
    }

    // Compare entered password with hashed password in database
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token with user ID and role
    const token = generateToken(user._id, user.role);

    // Return user data (without password) and token
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        mobile: user.mobile,
        role: user.role,
        studentId: user.studentId,
        cgpa: user.cgpa,
        batch: user.batch,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

/**
 * @desc    Get current logged-in user's profile
 * @route   GET /api/auth/me
 * @access  Private (requires JWT)
 * 
 * Returns the profile of the currently authenticated user.
 * The user is identified from the JWT token (set by authMiddleware).
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('batch', 'name isActive');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      username: user.username,
      mobile: user.mobile,
      role: user.role,
      studentId: user.studentId,
      cgpa: user.cgpa,
      batch: user.batch,
      isActive: user.isActive
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { login, getMe };
