const express = require("express");
const {
  getRooms,
  createRoom,
  joinRoom,
  sendMessage,
} = require("../controllers/chatroomController");
const {
  checkAuthorisation,
  checkAdmin,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", getRooms);
router.post("/create", checkAuthorisation, checkAdmin, createRoom);
// router.post("/join", checkAuthorisation, joinRoom);
// router.post("/Send-Message/:roomid", checkAuthorisation, sendMessage);

module.exports = router; // Ensure this is properly exported
