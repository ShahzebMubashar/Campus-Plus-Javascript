const express = require("express");
const {
  getRooms,
  createRoom,
  joinRoom,
  sendMessage,
  sendReply,
  processPost,
  createPost,
  LeaveRoom,
  changeRoomDetails,
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

router.get("/:roomid?", getRooms);
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
router.post(
  "/process/:roomid",
  checkAuthorisation,
  checkModerator,
  processPost
);
router.post("/:roomid/messages", createPost);
router.delete(
  "/leave/:roomid",
  checkAuthorisation,
  validateRoom,
  checkRoomMember,
  LeaveRoom
);
router.post(
  "/change-room-name/:roomid",
  checkAuthorisation,
  checkModerator,
  validateRoom,
  changeRoomDetails
);

module.exports = router;
