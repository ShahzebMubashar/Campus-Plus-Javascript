const express = require("express");

const {
  getChatrooms,
  createChatroom,
} = require("../controllers/chatroomController");
const {
  checkAuthorisation,
  checkAdmin,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", getChatrooms);
router.post("/create", checkAuthorisation, checkAdmin, createChatroom);

module.exports = router;
