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
  deleteRoom,
  deletePost,
  getPost,
  editPost,
  getPostEditHistory,
  pinPost,
  reportPost,
  createPoll,
  votePoll,
  trackPostView,
  getRoomMessages,
  searchPosts,
  getUserJoinedGroups,
  myRooms,
  addnestedReply,
} = require("../controllers/chatroomController");

const { jwtAuthMiddleware } = require("../middlewares/jwtAuthMiddleware");

const {
  checkRoomMember,
  validateRoom,
  checkModerator,
} = require("../middlewares/chatroomMiddlewares");

const router = express.Router();

router.get("/:roomid?", getRooms);
router.post("/create", jwtAuthMiddleware, createRoom);
router.post("/join/:roomid", jwtAuthMiddleware, validateRoom, joinRoom);
router.post(
  "/send-message/:roomid",
  jwtAuthMiddleware,
  checkRoomMember,
  sendMessage
);
router.post(
  "/reply1/:roomid/:parentMessage",
  jwtAuthMiddleware,
  checkRoomMember,
  sendReply
);
router.post(
  "/process/:roomid",
  jwtAuthMiddleware,
  checkModerator,
  processPost
);
router.post("/:roomid/messages", jwtAuthMiddleware, createPost);
router.delete(
  "/leave/:roomid",
  jwtAuthMiddleware,
  validateRoom,
  checkRoomMember,
  LeaveRoom
);
router.post(
  "/change-room-name/:roomid",
  jwtAuthMiddleware,
  checkModerator,
  validateRoom,
  changeRoomDetails
);
router.delete(
  "/delete/:roomid",
  jwtAuthMiddleware,
  validateRoom,
  deleteRoom
);
router.delete(
  "/:roomid/messages/:messageid",
  jwtAuthMiddleware,
  checkRoomMember,
  deletePost
);
router.get("/:roomid/messages/:messageid", getPost);

// Post editing routes
router.post("/:roomid/posts/:messageid/edit", jwtAuthMiddleware, editPost);
router.get(
  "/posts/:messageid/edit-history",
  jwtAuthMiddleware,
  getPostEditHistory
);

// Post pinning routes
router.post("/:roomid/posts/:messageid/pin", jwtAuthMiddleware, pinPost);

// Post reporting routes
router.post("/posts/:messageid/report", jwtAuthMiddleware, reportPost);

router.post("/posts/:messageid/view", jwtAuthMiddleware, trackPostView);

router.get("/messages/:roomid", getRoomMessages);
router.get("/search/:roomid", searchPosts);

router.get("/user/groups", jwtAuthMiddleware, getUserJoinedGroups);

router.get("/my-rooms/:userid", jwtAuthMiddleware, myRooms);

router.post(
  "/reply/:roomid/:parentReplyId",
  jwtAuthMiddleware,
  addnestedReply
);

module.exports = router;
