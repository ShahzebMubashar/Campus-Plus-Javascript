const express = require("express");

const {
  getCourses,
  rateCourse,
  reviewCourse,
} = require("../controllers/courseController");
const { checkAuthorisation } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", getCourses);
router.post("/Rate-Course", checkAuthorisation, rateCourse);
router.post("/Review-Course", checkAuthorisation, reviewCourse);

module.exports = router;
