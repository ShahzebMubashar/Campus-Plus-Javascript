const express = require("express");
const { body, validationResult } = require("express-validator");
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
const router = express.Router();

router.get("/test", (req, res) => {
  res.send("Auth routes are working!");
});

// Validation middleware for login
const loginValidation = [
  body("email").isEmail().withMessage("Valid email required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation middleware for register (customize fields as needed)
const registerValidation = [
  body("email").isEmail().withMessage("Valid email required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("username").notEmpty().withMessage("Username is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

router.post("/login", loginValidation, login);
router.post("/register", registerValidation, register);
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
router.post("/forgot", checkAuthorisation, forgotPassword);
router.post("/reset", checkAuthorisation, resetPassword);

module.exports = router;
