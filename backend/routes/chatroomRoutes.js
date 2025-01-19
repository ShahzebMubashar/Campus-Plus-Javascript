const express = require("express");
const {
  getRooms,
} = require("../controllers/chatroomController");
const {
  checkAuthorisation,
  checkAdmin,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", getRooms);

module.exports = router; // Ensure this is properly exported
