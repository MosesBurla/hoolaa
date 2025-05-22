const express = require('express');
const userController = require('../controllers/user.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

const router = express.Router();

// Protect all routes
router.use(protect);
router.use(restrictTo('ADMIN'));

router.route('/')
  .get(userController.getAllUsers);

router.route('/:id')
  .get(userController.getUserById)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;