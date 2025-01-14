const express = require("express");
const session = require("express-session");
const cors = require("cors");

const authRoutes = require("../routes/authRoutes");
const userRoutes = require("../routes/userRoutes");
const courseRoutes = require("../routes/courseRoutes");
const chatroomRoutes = require("../routes/chatroomRoutes");
const { errorHandler } = require("../middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 4000;

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
