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
router.post("/forgot", checkAuthorisation, forgotPassword);
router.post("/reset", checkAuthorisation, resetPassword);

module.exports = router;
