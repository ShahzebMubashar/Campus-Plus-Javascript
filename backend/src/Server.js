const express = require("express");
const session = require("express-session");
const cors = require("cors"); // Keep only one declaration of cors
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const authRoutes = require("../routes/authRoutes");
const userRoutes = require("../routes/userRoutes");
const courseRoutes = require("../routes/courseRoutes");
const chatroomRoutes = require("../routes/chatroomRoutes");
const { errorHandler } = require("../middlewares/errorHandler");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT_BACKEND || 5000;

// Use middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // Correct CORS usage
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 600000 }, // 10 minutes
  })
);
app.use(bodyParser.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/User", userRoutes);
app.use("/Courses", courseRoutes);
app.use("/Chatrooms", chatroomRoutes);

// Error handler
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
