// const express = require("express");
// const {
//   getRooms,
//   createRoom,
//   joinRoom,
//   getRoomMessages,
//   sendMessage,
// } = require("../controllers/chatroomController");
// // const {
// //   checkAuthorisation,
// //   checkAdmin,
// // } = require("../middlewares/authMiddleware");
// // const { checkRoomMember } = require("../middlewares/chatroomMiddlewares");

// const router = express.Router();

// // router.get("/", getRooms);
// // router.post("/create", checkAuthorisation, createRoom);
// // router.post("/join/:roomid", checkAuthorisation, joinRoom);
// // router.post(
// //   "/send-message/:roomid",
// //   checkAuthorisation,
// //   checkRoomMember,
// //   sendMessage
// // );

// // Get all rooms
// router.get('/getRooms', getRooms);

// // Create a new room
// router.post('/createRoom', createRoom);

// // Join a room
// router.post('/joinRoom/:roomid', joinRoom);

// // Get messages for a specific room
// router.get('/:roomid/messages', getRoomMessages);

// // Send a message in a specific room
// router.post('/:roomid/sendMessage', sendMessage);

// module.exports = router;


const express = require("express")
const {
  getRooms,
  createRoom,
  joinRoom,
  sendMessage,
  getRoomMessages,
  likePost,
  commentOnPost,
  getPostComments,
} = require("../controllers/chatroomController")
const { checkAuthorisation, checkAdmin } = require("../middlewares/authMiddleware")
const { checkRoomMember } = require("../middlewares/chatroomMiddlewares")

const router = express.Router()

router.get("/", getRooms)
router.post("/create", createRoom)
router.post("/join/:roomid", joinRoom)
router.post("/send-message/:roomid", checkRoomMember, sendMessage)
router.get("/messages/:roomid", checkRoomMember, getRoomMessages)
router.post("/like/:messageid", likePost)
router.post("/comment/:messageid", commentOnPost)
router.get("/comments/:messageid", getPostComments)

module.exports = router