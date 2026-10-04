/**
 * Role Authorization Middleware
 * 
 * This middleware checks if the authenticated user has the required role
 * to access a specific route. It MUST be used AFTER the protect middleware.
 * 
 * How it works:
 * 1. Takes an array of allowed roles (e.g., ['officer'], ['management'], ['student', 'officer'])
 * 2. Returns a middleware function that checks if req.user.role is in the allowed list
 * 3. If the role is allowed, the request proceeds
 * 4. If not, returns 403 Forbidden
 * 
 * IMPORTANT: The role is read from the DATABASE (via req.user set by authMiddleware),
 * NOT from the frontend request. This prevents role spoofing.
 * 
 * Usage example:
 *   router.post('/drives', protect, authorize('officer'), createDrive);
 *   router.get('/students', protect, authorize('management'), getStudents);
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // req.user.role comes from the database (set by authMiddleware)
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Role '${req.user.role}' is not authorized to access this resource.`
      });
    }
    next();
  };
};

module.exports = { authorize };
