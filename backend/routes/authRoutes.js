const express = require("express");
const {
  login,
  register,
  logout,
  testLogin,
  userRole,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { checkAuthorisation } = require("../middlewares/authMiddleware");
const passport = require("passport");
const pool = require("../config/database");
const router = express.Router();

router.get("/test", (req, res) => {
  res.send("Auth routes are working!");
});

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.post("/test-login", testLogin);

router.get("/user-role", checkAuthorisation, userRole);

router.get("/user-info", checkAuthorisation, (req, res) => {
  res.json({
    userid: req.session.user.userid,
    role: req.session.user.role,
    username: req.session.user.username,
  });
});

// Get current user (for OAuth authentication)
router.get("/current-user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      userid: req.user.userid,
      email: req.user.email,
      username: req.user.username,
      fullName: req.user.fullName,
      isAuthenticated: true,
      isProfileComplete: req.user.username && req.user.rollnumber && req.user.rollnumber !== 'PENDING'
    });
  } else {
    res.json({ isAuthenticated: false });
  }
});

// Complete profile route
router.post("/complete-profile", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Not authenticated" });
  }

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
router.post("/forgot", checkAuthorisation, forgotPassword);
router.post("/reset", checkAuthorisation, resetPassword);

// OAuth Routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Check if profile is complete
    if (req.user.username && req.user.rollnumber && req.user.rollnumber !== 'PENDING') {
      // Profile is complete, redirect to success page
      res.redirect("http://localhost:3000/auth-success");
    } else {
      // Profile incomplete, redirect to complete profile page
      res.redirect("http://localhost:3000/complete-profile");
    }
  }
);

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get("/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    // Check if profile is complete
    if (req.user.username && req.user.rollnumber && req.user.rollnumber !== 'PENDING') {
      // Profile is complete, redirect to success page
      res.redirect("http://localhost:3000/auth-success");
    } else {
      // Profile incomplete, redirect to complete profile page
      res.redirect("http://localhost:3000/complete-profile");
    }
  }
);

module.exports = router;
