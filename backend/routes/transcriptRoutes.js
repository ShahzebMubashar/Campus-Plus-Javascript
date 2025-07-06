const express = require("express");

const {
  addCourse,
  getTranscript,
  addSemester,
  removeCourse,
  removeSemester,
} = require("../controllers/transcriptController");
const { jwtAuthMiddleware } = require("../middlewares/jwtAuthMiddleware");

const router = express.Router();

router.get("/", jwtAuthMiddleware, getTranscript);
router.post("/add-course", jwtAuthMiddleware, addCourse);
router.post("/add-semester", jwtAuthMiddleware, addSemester);
router.delete("/remove-course/:transcriptId", jwtAuthMiddleware, removeCourse);
router.delete("/remove-semester/:semestername", jwtAuthMiddleware, removeSemester);

module.exports = router;
