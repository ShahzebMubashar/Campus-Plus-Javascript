const express = require("express");
const chatroomController = require("../controllers/chatroomController");
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
  likePost,
  getLikeCount,
  suggestRoom,
  getRoomSuggestions,
  reviewRoomSuggestion,
} = require("../controllers/chatroomController");

const { jwtAuthMiddleware, optionalJwtAuth } = require("../middlewares/jwtAuthMiddleware");

const {
  checkRoomMember,
  validateRoom,
  checkModerator,
} = require("../middlewares/chatroomMiddlewares");

const router = express.Router();

// ALL CHATROOM ROUTES REQUIRE AUTHENTICATION
router.get("/:roomid/messages/:messageid", jwtAuthMiddleware, getPost);
router.get("/likes/:messageid", jwtAuthMiddleware, getLikeCount);
router.get("/messages/:roomid", jwtAuthMiddleware, getRoomMessages);
router.get("/search/:roomid", jwtAuthMiddleware, searchPosts);

// Room management
router.post("/create", jwtAuthMiddleware, createRoom);
router.post("/join/:roomid", jwtAuthMiddleware, validateRoom, joinRoom);
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

// Messaging
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
  "/reply/:roomid/:parentReplyId",
  jwtAuthMiddleware,
  addnestedReply
);
router.post("/:roomid/messages", jwtAuthMiddleware, createPost);

// Post management
router.delete(
  "/:roomid/messages/:messageid",
  jwtAuthMiddleware,
  checkRoomMember,
  deletePost
);
router.post("/:roomid/posts/:messageid/edit", jwtAuthMiddleware, editPost);
router.get(
  "/posts/:messageid/edit-history",
  jwtAuthMiddleware,
  getPostEditHistory
);

// Post interactions
router.post("/like/:messageid", jwtAuthMiddleware, likePost);
router.post("/:roomid/posts/:messageid/pin", jwtAuthMiddleware, pinPost);
router.post("/posts/:messageid/report", jwtAuthMiddleware, reportPost);
router.post("/posts/:messageid/view", jwtAuthMiddleware, trackPostView);

// Moderation
router.post(
  "/process/:roomid",
  jwtAuthMiddleware,
  checkModerator,
  processPost
);

// User-specific
router.get("/user/groups", jwtAuthMiddleware, getUserJoinedGroups);
router.get("/my-rooms/:userid", jwtAuthMiddleware, myRooms);

// Polls
router.post("/polls", jwtAuthMiddleware, createPoll);
router.post("/polls/:pollid/vote", jwtAuthMiddleware, votePoll);

// Suggest Room
router.post("/suggest", jwtAuthMiddleware, suggestRoom);
router.get("/suggestions", jwtAuthMiddleware, chatroomController.getRoomSuggestions);
router.post("/suggestions/:id/review", jwtAuthMiddleware, reviewRoomSuggestion);
router.post("/suggestions/:id/edit", jwtAuthMiddleware, chatroomController.editRoomSuggestion);

// ALL CHATROOM ROUTES REQUIRE AUTHENTICATION
router.get("/:roomid?", jwtAuthMiddleware, getRooms);

module.exports = router;
