const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User registration validation
const validateRegister = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name is required and must be less than 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name is required and must be less than 50 characters'),
  handleValidationErrors
];

// User login validation
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Alert creation validation
const validateCreateAlert = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title is required and must be less than 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Description is required and must be less than 1000 characters'),
  body('severity')
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Severity must be one of: low, medium, high, critical'),
  body('category')
    .isIn(['phishing', 'malware', 'suspicious_domain', 'data_breach', 'vulnerability', 'other'])
    .withMessage('Invalid category'),
  body('domain')
    .optional()
    .isURL({ require_protocol: false, require_valid_protocol: false })
    .withMessage('Please provide a valid domain'),
  body('ipAddress')
    .optional()
    .isIP()
    .withMessage('Please provide a valid IP address'),
  handleValidationErrors
];

// Domain validation
const validateDomain = [
  body('domain')
    .matches(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/)
    .withMessage('Please provide a valid domain name'),
  handleValidationErrors
];

// ObjectId validation
const validateObjectId = (paramName = 'id') => [
  param(paramName)
    .isMongoId()
    .withMessage(`Invalid ${paramName}`),
  handleValidationErrors
];

// Query validation for alerts
const validateAlertQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('severity')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid severity filter'),
  query('status')
    .optional()
    .isIn(['new', 'investigating', 'resolved', 'false_positive'])
    .withMessage('Invalid status filter'),
  query('category')
    .optional()
    .isIn(['phishing', 'malware', 'suspicious_domain', 'data_breach', 'vulnerability', 'other'])
    .withMessage('Invalid category filter'),
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateCreateAlert,
  validateDomain,
  validateObjectId,
  validateAlertQuery,
  handleValidationErrors
};
