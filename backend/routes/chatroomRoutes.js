const express = require("express");

const {
  getChatrooms,
  createChatroom,
  joinRoom,
} = require("../controllers/chatroomController");

const {
  checkAuthorisation,
  checkAdmin,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", getChatrooms);
router.post("/create", checkAuthorisation, checkAdmin, createChatroom);
router.post("/join", checkAuthorisation, joinRoom);

module.exports = router;
