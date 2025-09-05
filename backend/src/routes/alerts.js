const express = require('express');
const { apiLimiter } = require('../middleware/rateLimiter');
const { authenticateToken } = require('../middleware/auth');
const { validateCreateAlert, validateObjectId, validateAlertQuery } = require('../middleware/validation');
const {
  getAlerts,
  getAlert,
  createAlert,
  updateAlert,
  resolveAlert,
  deleteAlert,
  getAlertStats
} = require('../controllers/alertController');

const router = express.Router();

// Apply rate limiting and authentication
router.use(apiLimiter);
router.use(authenticateToken);

// Routes
router.get('/', validateAlertQuery, getAlerts);
router.get('/stats', getAlertStats);
router.get('/:id', validateObjectId(), getAlert);
router.post('/', validateCreateAlert, createAlert);
router.put('/:id', validateObjectId(), updateAlert);
router.patch('/:id/resolve', validateObjectId(), resolveAlert);
router.delete('/:id', validateObjectId(), deleteAlert);

module.exports = router;
