const express = require('express');
const { apiLimiter } = require('../middleware/rateLimiter');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { validateDomain, validateObjectId } = require('../middleware/validation');
const {
  getSuspiciousDomains,
  getDomain,
  checkDomain,
  addSuspiciousDomain,
  updateDomain,
  deleteDomain,
  getDomainStats
} = require('../controllers/domainController');

const router = express.Router();

// Apply rate limiting
router.use(apiLimiter);

// Public routes (domain checking doesn't require auth)
router.post('/check', validateDomain, checkDomain);

// Protected routes
router.use(authenticateToken);
router.get('/', getSuspiciousDomains);
router.get('/stats', getDomainStats);
router.get('/:id', validateObjectId(), getDomain);
router.post('/', validateDomain, addSuspiciousDomain);
router.put('/:id', validateObjectId(), updateDomain);
router.delete('/:id', validateObjectId(), deleteDomain);

module.exports = router;
