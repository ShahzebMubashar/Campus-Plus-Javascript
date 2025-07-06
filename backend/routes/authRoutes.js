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

const frontendUrl = process.env.NODE_ENV === "production"
  ? process.env.FRONTEND_URL
  : "http://localhost:3000";

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

router.get("/current-user", optionalJwtAuth, (req, res) => {
  console.log("=== /auth/current-user ===");
  console.log("Auth type:", req.authType);
  console.log("User object:", req.user);
  
  if (req.user && req.authType === 'jwt') {
    console.log("Using JWT auth");
    res.json({
      userid: req.user.userid,
      email: req.user.email,
      username: req.user.username,
      fullName: req.user.fullName,
      isAuthenticated: true,
      isProfileComplete: req.user.username && req.user.rollnumber && req.user.rollnumber !== 'PENDING'
    });
  } else {
    console.log("No authentication");
    res.json({ isAuthenticated: false });
  }
  console.log("=== END /auth/current-user ===");
});

router.post("/complete-profile", jwtAuthMiddleware, async (req, res) => {
  const { username, rollnumber } = req.body;
  const userid = req.user.userid;

  if (!username || !rollnumber) {
    return res.status(400).json({ error: "Username and roll number are required" });
  }

  try {
    const client = await pool.connect();
    await client.query('BEGIN');

    const usernameCheck = await client.query(
      'SELECT * FROM Users WHERE username = $1 AND userid != $2',
      [username, userid]
    );

    if (usernameCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: "Username already exists" });
    }

    const rollnumberCheck = await client.query(
      'SELECT * FROM Users WHERE rollnumber = $1 AND userid != $2',
      [rollnumber, userid]
    );

    if (rollnumberCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: "Roll number already exists" });
    }

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

router.get("/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false
  })
);

router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: `${frontendUrl}/sign-in?error=oauth_failed`, session: false }),
  (req, res) => {
    try {
      console.log('Google OAuth callback - User object:', req.user);
      console.log('Google OAuth callback - User properties:', {
        userid: req.user?.userid,
        email: req.user?.email,
        username: req.user?.username,
        rollnumber: req.user?.rollnumber,
        fullName: req.user?.fullName,
        role: req.user?.role
      });
      
      const tokens = generateTokenPair(req.user);
      console.log('Generated tokens:', { accessToken: tokens.accessToken ? 'EXISTS' : 'MISSING', refreshToken: tokens.refreshToken ? 'EXISTS' : 'MISSING' });
      
      const tokenData = encodeURIComponent(JSON.stringify(tokens));
      console.log('Token data length:', tokenData.length);

      if (req.user.username && req.user.rollnumber && req.user.rollnumber !== 'PENDING') {
        console.log('Redirecting to auth-success');
        res.redirect(`${frontendUrl}/auth-success?tokens=${tokenData}`);
      } else {
        console.log('Redirecting to complete-profile');
        res.redirect(`${frontendUrl}/complete-profile?tokens=${tokenData}`);
      }
    } catch (error) {
      console.error('Google callback error:', error);
      res.redirect(`${frontendUrl}/sign-in?error=oauth_failed`);
    }
  }
);

router.get("/github",
  passport.authenticate("github", {
    scope: ["user:email"],
    session: false
  })
);

router.get("/github/callback",
  passport.authenticate("github", { failureRedirect: `${frontendUrl}/sign-in?error=oauth_failed`, session: false }),
  (req, res) => {
    try {
      const tokens = generateTokenPair(req.user);
      const tokenData = encodeURIComponent(JSON.stringify(tokens));

      if (req.user.username && req.user.rollnumber && req.user.rollnumber !== 'PENDING') {
        res.redirect(`${frontendUrl}/auth-success?tokens=${tokenData}`);
      } else {
        res.redirect(`${frontendUrl}/complete-profile?tokens=${tokenData}`);
      }
    } catch (error) {
      console.error('GitHub callback error:', error);
      res.redirect(`${frontendUrl}/sign-in?error=oauth_failed`);
    }
  }
);

module.exports = router;
