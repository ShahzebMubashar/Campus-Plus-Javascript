const express = require("express");

const {
  addCourse,
  getTranscript,
  addSemester,
  removeCourse,
  removeSemester,
} = require("../controllers/transcriptController");
const { checkAuthorisation } = require("../middlewares/authMiddleware");
const unifiedAuthMiddleware = require("../middlewares/unifiedAuthMiddleware");

const router = express.Router();

router.get("/", unifiedAuthMiddleware, getTranscript);
router.post("/add-course", unifiedAuthMiddleware, addCourse);
router.post("/add-semester", unifiedAuthMiddleware, addSemester);
router.delete("/remove-course/:transcriptId", unifiedAuthMiddleware, removeCourse);
router.delete("/remove-semester/:semestername", unifiedAuthMiddleware, removeSemester);

module.exports = router;
