const express = require('express');
const postController = require('../controllers/post.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate, postValidationRules } = require('../middleware/validator.middleware');

const router = express.Router();

// Public routes
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);

// Protected routes
router.use(protect);

router.post('/', postValidationRules, validate, postController.createPost);
router.get('/my/posts', postController.getMyPosts);
router.route('/:id')
  .put(postValidationRules, validate, postController.updatePost)
  .delete(postController.deletePost);

module.exports = router;