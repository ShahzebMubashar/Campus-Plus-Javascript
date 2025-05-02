const express = require("express");

const {
  addCourse,
  getTranscript,
  addSemester,
  removeCourse,
} = require("../controllers/transcriptController");
const { checkAuthorisation } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", checkAuthorisation, getTranscript);
router.post("/add-course", checkAuthorisation, addCourse);
router.post("/add-semester", checkAuthorisation, addSemester);
router.delete(
  "/remove-course/:transcriptId", // Changed endpoint to use transcriptId
  checkAuthorisation,
  removeCourse
);

module.exports = router;
// export default router;
