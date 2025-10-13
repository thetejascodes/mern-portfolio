
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    message: err.message, // error message
    stack: process.env.NODE_ENV === 'production' ? null : err.stack, // stack trace (hide in production)
  });
};

module.exports = errorHandler;
