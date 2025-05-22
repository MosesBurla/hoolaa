const express = require('express');
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate, registerValidationRules, loginValidationRules } = require('../middleware/validator.middleware');

const router = express.Router();

// Public routes
router.post('/register', registerValidationRules, validate, authController.register);
router.post('/login', loginValidationRules, validate, authController.login);

// Protected routes
router.get('/me', protect, authController.getMe);
router.put('/updateme', protect, authController.updateMe);
router.put('/updatepassword', protect, authController.updatePassword);

module.exports = router;