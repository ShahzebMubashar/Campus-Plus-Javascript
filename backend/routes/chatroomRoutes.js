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
  "/reply1/:roomid/:parentMessage",
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
router.delete(
  "/delete/:roomid",
  checkAuthorisation,
  checkAdmin,
  validateRoom,
  deleteRoom
);
router.delete(
  "/:roomid/messages/:messageid",
  checkAuthorisation,
  checkRoomMember,
  deletePost
);
router.get("/:roomid/messages/:messageid", getPost);

// Post editing routes
router.post("/:roomid/posts/:messageid/edit", checkAuthorisation, editPost);
router.get(
  "/posts/:messageid/edit-history",
  checkAuthorisation,
  getPostEditHistory
);

// Post pinning routes
router.post("/:roomid/posts/:messageid/pin", checkAuthorisation, pinPost);

// Post reporting routes
router.post("/posts/:messageid/report", checkAuthorisation, reportPost);

router.post("/posts/:messageid/view", checkAuthorisation, trackPostView);

router.get("/messages/:roomid", getRoomMessages);
router.get("/search/:roomid", searchPosts);

router.get("/user/groups", getUserJoinedGroups);

router.get("/my-rooms/:userid", checkAuthorisation, myRooms);

router.post(
  "/reply/:roomid/:parentReplyId",
  checkAuthorisation,
  addnestedReply
);

module.exports = router;
