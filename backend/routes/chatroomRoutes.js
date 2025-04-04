const express = require("express");
const {
  getRooms,
  createRoom,
  joinRoom,
  sendMessage,
  sendReply,
} = require("../controllers/chatroomController");

const {
  checkAuthorisation,
  checkAdmin,
} = require("../middlewares/authMiddleware");

const { checkRoomMember } = require("../middlewares/chatroomMiddlewares");

const router = express.Router();

router.get("/", getRooms);
router.post("/create", checkAuthorisation, createRoom);
router.post("/join/:roomid", checkAuthorisation, joinRoom);
router.post(
  "/send-message/:roomid",
  checkAuthorisation,
  checkRoomMember,
  sendMessage
);
router.post(
  "/reply/:roomid/:parentMessage",
  checkAuthorisation,
  checkRoomMember,
  sendReply
);

module.exports = router; // Ensure this is properly exported
