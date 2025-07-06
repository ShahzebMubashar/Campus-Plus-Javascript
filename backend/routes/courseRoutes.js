const express = require("express");
const { getCourses, rateCourse, reviewCourse, getPastPapers, downloadPastPapers, getCourseDetails, rateCourseDifficulty, addCourses } = require("../controllers/courseController.js");
const { jwtAuthMiddleware } = require("../middlewares/jwtAuthMiddleware.js");

const router = express.Router();

// Public routes (no authentication required)
router.get("/", getCourses);
router.get("/:courseId", getCourseDetails);
router.get("/:courseId/past-papers", getPastPapers);

// Protected routes (authentication required)
router.get("/past-papers/:paperId/download", jwtAuthMiddleware, downloadPastPapers);
router.post("/rate-course", jwtAuthMiddleware, rateCourse);
router.post("/rate-difficulty", jwtAuthMiddleware, rateCourseDifficulty);
router.post("/Review-Course", jwtAuthMiddleware, reviewCourse);
router.post("/add-courses", jwtAuthMiddleware, addCourses);

module.exports = router;
