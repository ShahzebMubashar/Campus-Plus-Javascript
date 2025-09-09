const { verifyToken, extractTokenFromHeader } = require('../utils/jwt');

const jwtAuthMiddleware = (req, res, next) => {

  try {
    const authHeader = req.headers.authorization;

    const token = extractTokenFromHeader(authHeader);
    if (!token) {
      return res.status(401).json({
        error: "Access token required",
        message: "Please provide a valid authorization token"
      });
    }

    const decoded = verifyToken(token);

    req.user = decoded;
    req.userid = decoded.userid;
    req.authType = 'jwt';

    next();

  } catch (error) {

    if (error.message.includes('expired')) {
      return res.status(401).json({
        error: "Token expired",
        message: "Your session has expired. Please log in again."
      });
    }

    if (error.message.includes('invalid')) {
      return res.status(401).json({
        error: "Invalid token",
        message: "Invalid authorization token provided."
      });
    }

    return res.status(401).json({
      error: "Authentication failed",
      message: "Token verification failed."
    });
  }
};

const optionalJwtAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = extractTokenFromHeader(authHeader);

  if (!token) {
    req.user = null;
    req.userid = null;
    req.authType = 'none';
    return next();
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    req.userid = decoded.userid;
    req.authType = 'jwt';
    next();
  } catch (error) {
    req.user = null;
    req.userid = null;
    req.authType = 'none';
    next();
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'Admin') {
    return res.status(403).json({
      error: "Admin access required",
      message: "You need administrator privileges to access this resource."
    });
  }
  next();
};

module.exports = {
  jwtAuthMiddleware,
  optionalJwtAuth,
  requireAdmin
}; 