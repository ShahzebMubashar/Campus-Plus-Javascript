const express = require("express");

const { getTranscript } = require("../controllers/transcriptController");
const { checkAuthorisation } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", checkAuthorisation, getTranscript);

module.exports = router;
