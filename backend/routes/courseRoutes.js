const express = require("express");
const cors = require("cors");
const { getCourses, rateCourse, reviewCourse } = require("../controllers/courseController.js");
const { checkAuthorisation } = require("../middlewares/authMiddleware.js");

const router = express.Router();
router.use(cors());


router.get("/", getCourses);

router.post("/rate-course", rateCourse);
router.post("/Review-Course", checkAuthorisation, reviewCourse);

module.exports = router;
