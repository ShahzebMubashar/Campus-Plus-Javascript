const express = require("express");
const { body, validationResult } = require("express-validator");
const {
  getCourses,
  rateCourse,
  reviewCourse,
  getPastPapers,
  downloadPastPapers,
  getCourseDetails,
  rateCourseDifficulty,
  addCourses,
} = require("../controllers/courseController.js");
const {
  checkAuthorisation,
  checkAdmin,
} = require("../middlewares/authMiddleware.js");

const router = express.Router();

// Validation for rating a course
const rateCourseValidation = [
  body("courseid").notEmpty().withMessage("Course ID is required"),
  body("rating").isNumeric().withMessage("Rating must be a number"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation for rating course difficulty
const rateDifficultyValidation = [
  body("courseid").notEmpty().withMessage("Course ID is required"),
  body("difficulty").isNumeric().withMessage("Difficulty must be a number"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation for reviewing a course
const reviewCourseValidation = [
  body("courseid").notEmpty().withMessage("Course ID is required"),
  body("review").notEmpty().withMessage("Review text is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation for adding courses (admin)
const addCoursesValidation = [
  body("courses").isArray({ min: 1 }).withMessage("Courses array is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

router.get("/", getCourses);
router.get("/:courseId", getCourseDetails);
router.get("/:courseId/past-papers", getPastPapers);
router.get("/past-papers/:paperId/download", downloadPastPapers);
router.post(
  "/rate-course",
  checkAuthorisation,
  rateCourseValidation,
  rateCourse,
);
router.post(
  "/rate-difficulty",
  checkAuthorisation,
  rateDifficultyValidation,
  rateCourseDifficulty,
);
router.post(
  "/Review-Course",
  checkAuthorisation,
  reviewCourseValidation,
  reviewCourse,
);
router.post("/add-courses", checkAdmin, addCoursesValidation, addCourses);

module.exports = router;
