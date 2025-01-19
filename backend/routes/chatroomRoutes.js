const express = require("express");
const {
  getChatrooms,
  createChatroom,
  joinRoom,
  sendMessage,
} = require("../controllers/chatroomController");
const {
  checkAuthorisation,
  checkAdmin,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", getChatrooms);
router.post("/create", checkAuthorisation, checkAdmin, createChatroom);
router.post("/join", checkAuthorisation, joinRoom);
router.post("/Send-Message/:roomid", checkAuthorisation, sendMessage);

module.exports = router; // Ensure this is properly exported
