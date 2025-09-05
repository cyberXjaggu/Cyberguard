const express = require('express');
const { apiLimiter } = require('../middleware/rateLimiter');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const {
  triggerFetch,
  getFetchStatus,
  getSources
} = require('../controllers/osintController');

const router = express.Router();

// Apply rate limiting and authentication
router.use(apiLimiter);
router.use(authenticateToken);

// Admin only routes
router.post('/fetch', requireAdmin, triggerFetch);
router.get('/status', getFetchStatus);
router.get('/sources', getSources);

module.exports = router;
