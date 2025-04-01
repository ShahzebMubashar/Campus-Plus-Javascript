const express = require("express");
const {
  getRooms,
  createRoom,
  joinRoom,
//   sendMessage,
} = require("../controllers/chatroomControllerCopy");
const {
  checkAuthorisation,
  checkAdmin,
} = require("../middlewares/authMiddleware");
const { checkRoomMember } = require("../middlewares/chatroomMiddlewares");

const router = express.Router();

router.get("/", getRooms);
router.post("/create", checkAuthorisation, createRoom);
router.post("/join/:roomid", checkAuthorisation, joinRoom);
// router.post(
//   "/send-message/:roomid",
//   checkAuthorisation,
//   checkRoomMember,
//   sendMessage
// );

module.exports = router; // Ensure this is properly exported