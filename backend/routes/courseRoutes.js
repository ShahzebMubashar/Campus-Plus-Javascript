const express = require("express");
const cors = require("cors");
const {
  getCourses,
  rateCourse,
  reviewCourse,
} = require("../controllers/courseController.js");
const { checkAuthorisation } = require("../middlewares/authMiddleware.js");

const router = express.Router();
router.use(cors());

router.get("/", getCourses, () => {
  console.log(`GET localhost:4000/Courses`);
});

router.post("/rate-course", checkAuthorisation, rateCourse);
router.post("/Review-Course", checkAuthorisation, reviewCourse);

module.exports = router;
