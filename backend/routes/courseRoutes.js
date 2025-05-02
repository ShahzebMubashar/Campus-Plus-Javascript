const express = require("express");
const { getCourses, rateCourse, reviewCourse, getPastPapers, downloadPastPapers, getCourseDetails, rateCourseDifficulty, addCourse } = require("../controllers/courseController.js");
const { checkAuthorisation,checkAdmin } = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.get("/", getCourses);
router.get("/:courseId", getCourseDetails);
router.get("/:courseId/past-papers", getPastPapers);
router.get("/past-papers/:paperId/download", downloadPastPapers);
router.post("/rate-course", checkAuthorisation, rateCourse);
router.post("/rate-difficulty", checkAuthorisation, rateCourseDifficulty);
router.post("/Review-Course", checkAuthorisation, reviewCourse);
router.post("/add-course", checkAdmin, addCourse);

module.exports = router;
