import express from "express";

import {
  getChatrooms,
  createChatroom,
  joinRoom,
} from "../controllers/chatroomController.js";

import { checkAuthorisation, checkAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getChatrooms);
router.post("/create", checkAuthorisation, checkAdmin, createChatroom);
router.post("/join", checkAuthorisation, joinRoom);

export default router;
