const express = require("express");

const {
  getTranscript,
  addCourse,
  removeCourse,
  editCourse,
} = require("../controllers/transcriptController");
const { checkAuthorisation } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", checkAuthorisation, getTranscript);

router.post("/add-course", checkAuthorisation, addCourse);

router.put("/edit-course", checkAuthorisation, editCourse);

router.delete("/remove-course", checkAuthorisation, removeCourse);

module.exports = router;
