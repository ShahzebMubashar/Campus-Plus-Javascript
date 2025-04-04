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

router.get("/:roomid?", getRooms);
router.post("/create", checkAuthorisation, createRoom);

router.post('/join/:roomid', checkAuthorisation, validateRoom, joinRoom, (req, res) => {
  const roomId = req.params.roomid;
  const userId = req.user?.id; // or wherever user info is stored

  if (!roomId || !userId) {
    return res.status(400).json({ error: "Missing room ID or user ID" });
  }

  // Your join logic here...
});

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
