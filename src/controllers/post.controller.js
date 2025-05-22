const { prisma } = require('../config/db.config');
const AppError = require('../utils/appError');
const logger = require('../config/logger.config');

/**
 * @desc    Create a new post
 * @route   POST /api/posts
 * @access  Private
 */
exports.createPost = async (req, res, next) => {
  try {
    const { title, content, published } = req.body;

    const post = await prisma.post.create({
      data: {
        title,
        content,
        published: published || false,
        author: {
          connect: { id: req.user.id }
        }
      }
    });

    res.status(201).json({
      status: 'success',
      data: {
        post
      }
    });
  } catch (error) {
    logger.error(`Error in createPost: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get all posts
 * @route   GET /api/posts
 * @access  Public
 */
exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true
      },
      include: {
        author: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.status(200).json({
      status: 'success',
      results: posts.length,
      data: {
        posts
      }
    });
  } catch (error) {
    logger.error(`Error in getAllPosts: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get post by ID
 * @route   GET /api/posts/:id
 * @access  Public
 */
exports.getPostById = async (req, res, next) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: req.params.id },
      include: {
        author: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        post
      }
    });
  } catch (error) {
    logger.error(`Error in getPostById: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Update post
 * @route   PUT /api/posts/:id
 * @access  Private
 */
exports.updatePost = async (req, res, next) => {
  try {
    const { title, content, published } = req.body;

    // Check if post exists and belongs to user or user is admin
    const post = await prisma.post.findUnique({
      where: { id: req.params.id }
    });

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    if (post.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return next(new AppError('You are not authorized to update this post', 403));
    }

    // Update post
    const updatedPost = await prisma.post.update({
      where: { id: req.params.id },
      data: {
        title,
        content,
        published
      }
    });

    res.status(200).json({
      status: 'success',
      data: {
        post: updatedPost
      }
    });
  } catch (error) {
    logger.error(`Error in updatePost: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Delete post
 * @route   DELETE /api/posts/:id
 * @access  Private
 */
exports.deletePost = async (req, res, next) => {
  try {
    // Check if post exists and belongs to user or user is admin
    const post = await prisma.post.findUnique({
      where: { id: req.params.id }
    });

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    if (post.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return next(new AppError('You are not authorized to delete this post', 403));
    }

    // Delete post
    await prisma.post.delete({
      where: { id: req.params.id }
    });

    res.status(200).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    logger.error(`Error in deletePost: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get user's posts
 * @route   GET /api/posts/my
 * @access  Private
 */
exports.getMyPosts = async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        authorId: req.user.id
      }
    });

    res.status(200).json({
      status: 'success',
      results: posts.length,
      data: {
        posts
      }
    });
  } catch (error) {
    logger.error(`Error in getMyPosts: ${error.message}`);
    next(error);
  }
};