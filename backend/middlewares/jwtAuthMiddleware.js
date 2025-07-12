const { verifyToken, extractTokenFromHeader } = require('../utils/jwt');

/**
 * JWT Authentication Middleware
 * Replaces session-based authentication
 */
const jwtAuthMiddleware = (req, res, next) => {
  console.log("=== JWT AUTH MIDDLEWARE ===");
  console.log("Path:", req.path);
  console.log("Method:", req.method);

  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    console.log("Authorization header:", authHeader ? "EXISTS" : "NONE");

    const token = extractTokenFromHeader(authHeader);
    if (!token) {
      console.log("❌ No token found in Authorization header");
      return res.status(401).json({ 
        error: "Access token required",
        message: "Please provide a valid authorization token"
      });
    }

    // Verify the token
    const decoded = verifyToken(token);
    console.log("✅ Token verified for user:", decoded.username);

    // Attach user info to request object
    req.user = decoded;
    req.userid = decoded.userid;
    req.authType = 'jwt';

    console.log("✅ JWT authentication successful");
    console.log("=== END JWT AUTH ===");
    next();

  } catch (error) {
    console.log("❌ JWT verification failed:", error.message);
    console.log("=== END JWT AUTH ===");
    
    // Handle different types of JWT errors
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

/**
 * Optional JWT middleware - doesn't fail if no token
 * Useful for endpoints that work for both authenticated and non-authenticated users
 */
const optionalJwtAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = extractTokenFromHeader(authHeader);

  if (!token) {
    // No token provided, continue without authentication
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
    // Invalid token, continue without authentication
    req.user = null;
    req.userid = null;
    req.authType = 'none';
    next();
  }
};

/**
 * Admin role check middleware (use after jwtAuthMiddleware)
 */
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