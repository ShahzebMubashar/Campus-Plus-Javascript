const express = require("express");
const { body, validationResult } = require("express-validator");
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

// Validation for creating a room
const createRoomValidation = [
  body("roomName").notEmpty().withMessage("Room name is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation for sending a message
const sendMessageValidation = [
  body("content").notEmpty().withMessage("Message content is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation for creating a post
const createPostValidation = [
  body("content").notEmpty().withMessage("Post content is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

router.get("/:roomid?", getRooms);
router.post("/create", checkAuthorisation, createRoomValidation, createRoom);
router.post("/join/:roomid", checkAuthorisation, validateRoom, joinRoom);
router.post(
  "/send-message/:roomid",
  checkAuthorisation,
  checkRoomMember,
  sendMessageValidation,
  sendMessage,
);
router.post(
  "/reply1/:roomid/:parentMessage",
  checkAuthorisation,
  checkRoomMember,
  sendReply,
);
router.post(
  "/process/:roomid",
  checkAuthorisation,
  checkModerator,
  processPost,
);
router.post("/:roomid/messages", createPostValidation, createPost);
router.delete(
  "/leave/:roomid",
  checkAuthorisation,
  validateRoom,
  checkRoomMember,
  LeaveRoom,
);
router.post(
  "/change-room-name/:roomid",
  checkAuthorisation,
  checkModerator,
  validateRoom,
  changeRoomDetails,
);
router.delete(
  "/delete/:roomid",
  checkAuthorisation,
  checkAdmin,
  validateRoom,
  deleteRoom,
);
router.delete(
  "/:roomid/messages/:messageid",
  checkAuthorisation,
  checkRoomMember,
  deletePost,
);
router.get("/:roomid/messages/:messageid", getPost);

// Post editing routes
router.post("/:roomid/posts/:messageid/edit", checkAuthorisation, editPost);
router.get(
  "/posts/:messageid/edit-history",
  checkAuthorisation,
  getPostEditHistory,
);

// Post pinning routes
router.post("/:roomid/posts/:messageid/pin", checkAuthorisation, pinPost);

// Post reporting routes
router.post("/posts/:messageid/report", checkAuthorisation, reportPost);

router.post("/posts/:messageid/view", checkAuthorisation, trackPostView);

router.get("/messages/:roomid", getRoomMessages);
router.get("/search/:roomid", searchPosts);

router.get("/user/groups", checkAuthorisation, getUserJoinedGroups);

router.get("/my-rooms/:userid", checkAuthorisation, myRooms);

router.post(
  "/reply/:roomid/:parentReplyId",
  checkAuthorisation,
  addnestedReply,
);

module.exports = router;
