const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication Middleware (protect)
 * 
 * This middleware verifies the JWT token sent in the request header.
 * It runs BEFORE the actual route handler to ensure the user is logged in.
 * 
 * How it works:
 * 1. Checks if the Authorization header exists and starts with 'Bearer'
 * 2. Extracts the token from the header
 * 3. Verifies the token using the JWT_SECRET
 * 4. Finds the user in the database using the ID from the token
 * 5. Attaches the user object to req.user for use in subsequent middleware/controllers
 * 
 * If any step fails, the request is rejected with a 401 Unauthorized response.
 */
const protect = async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token (format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by ID from token payload (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Check if account is active
      if (!req.user.isActive) {
        return res.status(401).json({ message: 'Account is disabled. Contact college management.' });
      }

      next(); // Proceed to the next middleware/route handler
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token is invalid' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
