const express = require("express");
const cors = require("cors");
const { getCourses, rateCourse, reviewCourse, getPastPapers, downloadPastPapers } = require("../controllers/courseController.js");
const { checkAuthorisation } = require("../middlewares/authMiddleware.js");

const router = express.Router();
router.use(cors());

router.get("/", getCourses, () => {
  console.log(`GET localhost:4000/Courses`);
});

router.get("/", getCourses);
router.get("/:courseId/past-papers",getPastPapers)
router.get("/past-papers/:paperId/download",downloadPastPapers)
router.post("/rate-course", checkAuthorisation, rateCourse);
router.post("/Review-Course", checkAuthorisation, reviewCourse);

module.exports = router;
