const AppError = require('../utils/appError');
const logger = require('../config/logger.config');

/**
 * Handle 404 errors
 */
exports.notFound = (req, res, next) => {
  next(new AppError(`Not found - ${req.originalUrl}`, 404));
};

/**
 * Handle validation errors
 */
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

/**
 * Handle database errors
 */
const handleDatabaseError = (err) => {
  const message = `Database error: ${err.message}`;
  return new AppError(message, 500);
};

/**
 * Handle JWT errors
 */
const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401);
const handleJWTExpiredError = () => new AppError('Your token has expired! Please log in again.', 401);

/**
 * Send detailed error in development
 */
const sendErrorDev = (err, res) => {
  logger.error(`ERROR: ${err.message}`);
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

/**
 * Send simplified error in production
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
    // Programming or other unknown error: don't leak error details
  } else {
    // Log error
    logger.error(`ERROR: ${err.message}`);
    
    // Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    });
  }
};

/**
 * Global error handler
 */
exports.errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (err.name === 'ValidationError') error = handleValidationError(err);
    if (err.code === 'P2002') error = handleDatabaseError(err);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};