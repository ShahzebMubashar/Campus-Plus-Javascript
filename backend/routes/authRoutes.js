const express = require("express");
const { login, register, logout } = require("../controllers/authController");

const router = express.Router();

// Test route
router.get("/test", (req, res) => {
  res.send("Auth routes are working!");
});

// Auth routes
router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);

module.exports = router;
