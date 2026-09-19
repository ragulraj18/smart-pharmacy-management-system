// =====================================================
// NOT FOUND MIDDLEWARE
// Handles routes that don't match any endpoint
// =====================================================

const notFound = (req, res, next) => {
  const error = new Error(
    `Route not found - ${req.originalUrl}`
  );

  res.status(404);

  next(error);
};


// =====================================================
// CENTRAL ERROR HANDLER
// Handles all errors from the application
// =====================================================

const errorHandler = (err, req, res, next) => {

  // TEMPORARY DEBUGGING LOG
  // This prints the complete error stack in the backend terminal.
  console.error('=========================================');
  console.error('ERROR STACK:');
  console.error(err.stack);
  console.error('=========================================');

  // If no status code was previously set,
  // return HTTP 500 Internal Server Error.
  const statusCode =
    res.statusCode === 200
      ? 500
      : res.statusCode;

  // Send error response to frontend
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Error',

    // Show stack only during development
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
    }),
  });
};


// =====================================================
// EXPORT MIDDLEWARE
// =====================================================

module.exports = {
  notFound,
  errorHandler,
};