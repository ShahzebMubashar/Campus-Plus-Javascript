const express = require("express");

const {
  addCourse,
  getTranscript,
  addSemester,
  removeCourse,
  removeSemester,
} = require("../controllers/transcriptController");
const { checkAuthorisation } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", checkAuthorisation, getTranscript);
router.post("/add-course", checkAuthorisation, addCourse);
router.post("/add-semester", checkAuthorisation, addSemester);
router.delete("/remove-course/:transcriptId", checkAuthorisation, removeCourse);
router.delete("/remove-semester/:semestername", checkAuthorisation, removeSemester);

module.exports = router;
