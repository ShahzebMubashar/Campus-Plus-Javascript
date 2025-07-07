const express = require("express");
const {
  viewUserInfo,
  editUserInfo,
  currentCourses,
  getReminders,
  addReminder,
  deleteReminder,
  updatePriority,
} = require("../controllers/userController");
const { jwtAuthMiddleware } = require("../middlewares/jwtAuthMiddleware");

const router = express.Router();

router.get("/profile", jwtAuthMiddleware, viewUserInfo);
router.put("/profile", jwtAuthMiddleware, editUserInfo);
router.get("/current-courses", jwtAuthMiddleware, currentCourses);
router.get("/my-reminders", jwtAuthMiddleware, getReminders);
router.post("/add-reminder", jwtAuthMiddleware, addReminder);
router.delete(
  "/delete-reminder/:reminderid",
  jwtAuthMiddleware,
  deleteReminder
);
router.put("/update-priority/:reminderid", jwtAuthMiddleware, updatePriority);

module.exports = router;
