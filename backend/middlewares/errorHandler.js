// Centralized error handler middleware
module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  const isProd = process.env.NODE_ENV === "production";

  // Log the error (could use winston/morgan for more advanced logging)
  console.error(err);

  res.status(status).json({
    error: isProd ? "An unexpected error occurred." : err.message,
    ...(isProd ? {} : { stack: err.stack }),
  });
};
