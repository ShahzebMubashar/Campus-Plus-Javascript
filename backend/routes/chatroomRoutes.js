const express = require("express");
const {
  getRooms,
  createRoom,
  joinRoom,
  sendMessage,
  sendReply,
  leaveRoom,
  processPost,
} = require("../controllers/chatroomController");

const {
  checkAuthorisation,
  checkAdmin,
} = require("../middlewares/authMiddleware");

const {
  checkRoomMember,
  validateRoom,
  checkModerator,
} = require("../middlewares/chatroomMiddlewares");

const router = express.Router();

router.get("/", getRooms);
router.post("/create", checkAuthorisation, createRoom);
router.post("/join/:roomid", checkAuthorisation, validateRoom, joinRoom);
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
router.delete(
  "/leave/:roomid",
  checkAuthorisation,
  validateRoom,
  checkRoomMember,
  leaveRoom
);
router.post(
  "/process/:roomid",
  checkAuthorisation,
  checkModerator,
  processPost
);

module.exports = router; // Ensure this is properly exported
