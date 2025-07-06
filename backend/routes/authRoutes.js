const express = require("express");
const {
  login,
  register,
  logout,
  testLogin,
  userRole,
  forgotPassword,
  resetPassword,
  refreshToken,
  currentUser,
} = require("../controllers/authController");
const { jwtAuthMiddleware, optionalJwtAuth } = require("../middlewares/jwtAuthMiddleware");
const { generateTokenPair } = require("../utils/jwt");
const passport = require("passport");
const pool = require("../config/database");
const router = express.Router();
const frontendUrl = process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL : "http://localhost:3000";
      

router.get("/test", (req, res) => {
  res.send("Auth routes are working!");
});

router.post("/login", login);
router.post("/register", register);
router.post("/logout", jwtAuthMiddleware, logout);
router.post("/test-login", testLogin);
router.post("/refresh-token", refreshToken);

router.get("/user-role", jwtAuthMiddleware, userRole);

router.get("/user-info", jwtAuthMiddleware, (req, res) => {
  res.json({
    userid: req.user.userid,
    role: req.user.role,
    username: req.user.username,
  });
});

// Get current user (works with both JWT and OAuth)
router.get("/current-user", optionalJwtAuth, (req, res) => {
  // First check OAuth authentication
  if (req.isAuthenticated && req.isAuthenticated()) {
    res.json({
      userid: req.user.userid,
      email: req.user.email,
      username: req.user.username,
      fullName: req.user.fullName,
      isAuthenticated: true,
      isProfileComplete: req.user.username && req.user.rollnumber && req.user.rollnumber !== 'PENDING'
    });
  } else if (req.user) {
    // JWT authentication
    res.json({
      userid: req.user.userid,
      email: req.user.email,
      username: req.user.username,
      fullName: req.user.fullName,
      isAuthenticated: true,
      isProfileComplete: true // JWT users are already authenticated
    });
  } else {
    res.json({ isAuthenticated: false });
  }
});

// Complete profile route
router.post("/complete-profile", jwtAuthMiddleware, async (req, res) => {

  const { username, rollnumber } = req.body;
  const userid = req.user.userid;

  if (!username || !rollnumber) {
    return res.status(400).json({ error: "Username and roll number are required" });
  }

  try {
    const client = await pool.connect();
    await client.query('BEGIN');

    // Check if username already exists
    const usernameCheck = await client.query(
      'SELECT * FROM Users WHERE username = $1 AND userid != $2',
      [username, userid]
    );

    if (usernameCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: "Username already exists" });
    }

    // Check if rollnumber already exists
    const rollnumberCheck = await client.query(
      'SELECT * FROM Users WHERE rollnumber = $1 AND userid != $2',
      [rollnumber, userid]
    );

    if (rollnumberCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: "Roll number already exists" });
    }

    // Update user profile
    await client.query(
      'UPDATE Users SET username = $1, rollnumber = $2 WHERE userid = $3',
      [username, rollnumber, userid]
    );

    await client.query('COMMIT');

    res.json({
      message: "Profile completed successfully",
      user: {
        userid: userid,
        username: username,
        rollnumber: rollnumber,
        email: req.user.email,
        fullName: req.user.fullName
      }
    });
  } catch (error) {
    console.error('Profile completion error:', error);
    res.status(500).json({ error: "Server error" });
  }
});
router.post("/forgot", jwtAuthMiddleware, forgotPassword);
router.post("/reset", jwtAuthMiddleware, resetPassword);

// OAuth Routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    try {
      // Generate JWT tokens for OAuth user
      const tokens = generateTokenPair(req.user);
      
      // Encode tokens in URL for frontend to extract
      const tokenData = encodeURIComponent(JSON.stringify(tokens));
      
      // Check if profile is complete
      if (req.user.username && req.user.rollnumber && req.user.rollnumber !== 'PENDING') {
        // Profile is complete, redirect to success page with tokens
        res.redirect(`${frontendUrl}/auth-success?tokens=${tokenData}`);
      } else {
        // Profile incomplete, redirect to complete profile page with tokens
        res.redirect(`${frontendUrl}/complete-profile?tokens=${tokenData}`);
      }
    } catch (error) {
      console.error('Google callback error:', error);
      res.redirect(`${frontendUrl}/login?error=oauth_failed`);
    }
  }
);

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get("/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    try {
      // Generate JWT tokens for OAuth user
      const tokens = generateTokenPair(req.user);
      
      // Encode tokens in URL for frontend to extract
      const tokenData = encodeURIComponent(JSON.stringify(tokens));
      
      // Check if profile is complete
      if (req.user.username && req.user.rollnumber && req.user.rollnumber !== 'PENDING') {
        // Profile is complete, redirect to success page with tokens
        res.redirect(`${frontendUrl}/auth-success?tokens=${tokenData}`);
      } else {
        // Profile incomplete, redirect to complete profile page with tokens
        res.redirect(`${frontendUrl}/complete-profile?tokens=${tokenData}`);
      }
    } catch (error) {
      console.error('GitHub callback error:', error);
      res.redirect(`${frontendUrl}/login?error=oauth_failed`);
    }
  }
);

module.exports = router;
