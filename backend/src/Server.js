// const express = require("express");
// const session = require("express-session");
// const cors = require("cors");

// const authRoutes = require("../routes/authRoutes");
// const userRoutes = require("../routes/userRoutes");
// const courseRoutes = require("../routes/courseRoutes");
// const chatroomRoutes = require("../routes/chatroomRoutes");
// const { errorHandler } = require("../middlewares/errorHandler");

import express from "express";
import session from "express-session";
import cors from "cors";

import authRoutes from "../routes/authRoutes.js";
import userRoutes from "../routes/userRoutes.js";
import courseRoutes from "../routes/courseRoutes.js";
import chatroomRoutes from "../routes/chatroomRoutes.js";
import { errorHandler } from "../middlewares/errorHandler.js";

const app = express();
const PORT = process.env.PORT_BACKEND || 4000;

app.use(express.json());
app.use(cors());
app.use(
  session({
    secret: "CampusPlus",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/", authRoutes);
app.use("/User", userRoutes);
app.use("/Courses", courseRoutes);
app.use("/Chatrooms", chatroomRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
