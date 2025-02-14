const express = require("express");
const {
  getRooms,
  createRoom,
  joinRoom,
  getRoomMessages,
  sendMessage,
} = require("../controllers/chatroomController");
// const {
//   checkAuthorisation,
//   checkAdmin,
// } = require("../middlewares/authMiddleware");
// const { checkRoomMember } = require("../middlewares/chatroomMiddlewares");

const router = express.Router();

// router.get("/", getRooms);
// router.post("/create", checkAuthorisation, createRoom);
// router.post("/join/:roomid", checkAuthorisation, joinRoom);
// router.post(
//   "/send-message/:roomid",
//   checkAuthorisation,
//   checkRoomMember,
//   sendMessage
// );

// Get all rooms
router.get('/getRooms', getRooms);

// Create a new room
router.post('/createRoom', createRoom);

// Join a room
router.post('/joinRoom/:roomid', joinRoom);

// Get messages for a specific room
router.get('/:roomid/messages', getRoomMessages);

// Send a message in a specific room
router.post('/:roomid/sendMessage', sendMessage);

module.exports = router;
