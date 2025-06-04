const express = require('express');
const router = express.Router();

const {
  register,
  login,
  forgotPassword,
  getProfile
} = require('../controllers/authController');

const { authenticateToken } = require('../middleware/authMiddleware');

// ✅ Authenticated route
router.get('/profile', authenticateToken, getProfile);

// ✅ Public routes
router.post('/signup', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

module.exports = router;
