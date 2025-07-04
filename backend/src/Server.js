const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const pool = require("../config/database");
require("dotenv").config();

const {
  checkAuthorisation,
  checkAdmin,
} = require("../middlewares/authMiddleware");
const authRoutes = require("../routes/authRoutes");
const courseRoutes = require("../routes/courseRoutes");
const chatroomRoute = require("../routes/chatroomRoutes");
const transcriptRoute = require("../routes/transcriptRoutes");
const emailRoute = require("../routes/emailRoutes");
const userRoutes = require("../routes/userRoutes");
const chatroomController = require("../controllers/chatroomController");
const errorHandler = require("../middlewares/errorHandler");

const app = require("../app"); // Use the secure app setup from app.js
const PORT = process.env.PORT_BACKEND || 4000;

// Basic middleware
app.use(express.json());
app.use(cookieParser());

// Session configuration
app.use(
  session({
    name: "connect.sid",
    secret: process.env.SESSION_SECRET || "CampusPlus",
    resave: true,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      path: "/",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    },
    proxy: true,
  }),
);

// Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/Courses", courseRoutes);
app.use("/Chatrooms", chatroomRoute);
app.use("/Transcripts", transcriptRoute);
app.use("/api/email", emailRoute);

app.get("/test", (req, res) => {
  res.send("Server is running and routes are registered!");
});

app.get("/Chatrooms/messages/:roomid", chatroomController.getRoomMessages); // Call controller's function
app.post("/Chatrooms/like/:messageid", chatroomController.likePost); // Like a post
app.get("/Chatrooms/likes/:messageid", chatroomController.getLikeCount); // Get like count for a post

// Centralized error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
