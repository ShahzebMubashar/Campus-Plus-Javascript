const express = require("express");

const { getTranscript } = require("../controllers/transcriptController");
const { checkAuthorization } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", checkAuthorization, getTranscript);

module.exports = router;
