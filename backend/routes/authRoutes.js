const express = require('express');
const router = express.Router();
const { login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/auth/login — Public route for all roles
router.post('/login', login);

// GET /api/auth/me — Private route, requires valid JWT
router.get('/me', protect, getMe);

module.exports = router;
