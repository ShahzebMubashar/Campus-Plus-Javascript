const express = require("express");
const { body, validationResult } = require("express-validator");
const {
  addCourse,
  getTranscript,
  addSemester,
  removeCourse,
  removeSemester,
} = require("../controllers/transcriptController");
const { checkAuthorisation } = require("../middlewares/authMiddleware");

const router = express.Router();

// Validation for adding a course
const addCourseValidation = [
  body("courseName").notEmpty().withMessage("Course name is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation for adding a semester
const addSemesterValidation = [
  body("semesterName").notEmpty().withMessage("Semester name is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

router.get("/", checkAuthorisation, getTranscript);
router.post("/add-course", checkAuthorisation, addCourseValidation, addCourse);
router.post(
  "/add-semester",
  checkAuthorisation,
  addSemesterValidation,
  addSemester,
);
router.delete("/remove-course/:transcriptId", checkAuthorisation, removeCourse);
router.delete(
  "/remove-semester/:semestername",
  checkAuthorisation,
  removeSemester,
);

module.exports = router;
