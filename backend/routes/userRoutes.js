const express = require("express");
const { body, validationResult } = require("express-validator");
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

const router = express.Router();

// Validation for editing user info (customize fields as needed)
const editUserValidation = [
  body("email").optional().isEmail().withMessage("Valid email required"),
  body("username")
    .optional()
    .notEmpty()
    .withMessage("Username cannot be empty"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation for adding a reminder
const addReminderValidation = [
  body("reminder").notEmpty().withMessage("Reminder text is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

router.get("/profile", checkAuthorisation, viewUserInfo);
router.put("/profile", checkAuthorisation, editUserValidation, editUserInfo);
router.get("/current-courses", checkAuthorisation, currentCourses);
router.get("/my-reminders", checkAuthorisation, getReminders);
router.post(
  "/add-reminder",
  checkAuthorisation,
  addReminderValidation,
  addReminder,
);
router.delete(
  "/delete-reminder/:reminderid",
  checkAuthorisation,
  deleteReminder,
);
router.put("/update-priority/:reminderid", checkAuthorisation, updatePriority);

module.exports = router;
