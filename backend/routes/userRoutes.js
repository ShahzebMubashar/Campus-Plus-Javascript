const express = require("express");
const {
  viewUserInfo,
  editUserInfo,
  currentCourses,
  getReminders,
  addReminder,
} = require("../controllers/userController");
const { checkAuthorisation } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/profile", checkAuthorisation, viewUserInfo);
router.put("/profile", checkAuthorisation, editUserInfo);
router.get("/current-courses", checkAuthorisation, currentCourses);
router.get("/my-reminders", checkAuthorisation, getReminders);
router.post("/add-reminder", checkAuthorisation, addReminder);

module.exports = router;
