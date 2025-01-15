const express = require("express");
const session = require("express-session");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
// const authRoutes = require("./routes/authRoutes");
const authRoutes = require("../routes/authRoutes");
const userRoutes = require("../routes/userRoutes");
const courseRoutes = require("../routes/courseRoutes");
const chatroomRoutes = require("../routes/chatroomRoutes");
const { errorHandler } = require("../middlewares/errorHandler");

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

app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 600000 }, // 10 minutes
  })
);

app.use("/", authRoutes);
app.use("/User", userRoutes);
app.use("/Courses", courseRoutes);
app.use("/Chatrooms", chatroomRoutes);
app.use("/api/auth", authRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
