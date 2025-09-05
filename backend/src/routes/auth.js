const express = require('express');
const { authLimiter } = require('../middleware/rateLimiter');
const { authenticateToken, authenticateRefreshToken } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validation');
const {
  register,
  login,
  refreshToken,
  logout,
  getProfile
} = require('../controllers/authController');

const router = express.Router();

// Apply rate limiting to auth routes
router.use(authLimiter);

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/refresh', authenticateRefreshToken, refreshToken);

// Protected routes
router.use(authenticateToken);
router.get('/profile', getProfile);
router.post('/logout', logout);

module.exports = router;
