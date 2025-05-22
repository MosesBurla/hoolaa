const { validationResult, body } = require('express-validator');
const AppError = require('../utils/appError');

/**
 * Middleware to handle validation errors
 */
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);
    return next(new AppError(errorMessages.join(', '), 400));
  }
  next();
};

/**
 * Registration validation rules
 */
exports.registerValidationRules = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one special character'),
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .trim()
];

/**
 * Login validation rules
 */
exports.loginValidationRules = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

/**
 * Post validation rules
 */
exports.postValidationRules = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .trim(),
  body('content')
    .notEmpty()
    .withMessage('Content is required')
    .trim()
];