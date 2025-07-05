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
const { checkAuthorisation } = require("../middlewares/authMiddleware");
const unifiedAuthMiddleware = require("../middlewares/unifiedAuthMiddleware");

const router = express.Router();

router.get("/profile", unifiedAuthMiddleware, viewUserInfo);
router.put("/profile", unifiedAuthMiddleware, editUserInfo);
router.get("/current-courses", unifiedAuthMiddleware, currentCourses);
router.get("/my-reminders", unifiedAuthMiddleware, getReminders);
router.post("/add-reminder", unifiedAuthMiddleware, addReminder);
router.delete(
  "/delete-reminder/:reminderid",
  unifiedAuthMiddleware,
  deleteReminder
);
router.put("/update-priority/:reminderid", unifiedAuthMiddleware, updatePriority);

module.exports = router;
