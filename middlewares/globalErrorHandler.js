const createError = require('http-errors');

function notFound(req, res, next) {
  next(createError(404, 'Page Not Found'));
}

function globalErrorHandler(err, req, res, next) {
  // Check if the error is a Joi validation error
  if (err.isJoi) {
    // Extract only the messages from the Joi validation error
    const messages = err.details.map(detail => detail.message);

    return res.status(400).json({
      status: 400,
      message: 'Validation Error',
      errors: messages // Just the validation messages
    });
  }

  const statusCode = err.status || 500;
  res.status(statusCode);

  // Response JSON for other types of errors
  res.json({
    status: statusCode,
    message: err?.response?.data?.message ?? err?.response?.data?.responseMessage ?? err?.message ?? err,
    ...(req.app.get('env') === 'development' && { stack: err.stack })
  });
}

module.exports = {
  notFound,
  globalErrorHandler
};
