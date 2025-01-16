const express = require("express");
const { login, register, logout } = require("../controllers/authController");
const { checkAuthorisation } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/login", login);       // Login route
router.post("/register", register); // Register route
// router.post("/logout", checkAuthorisation, logout); 

module.exports = router;
