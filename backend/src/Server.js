const express = require("express");
const session = require("express-session");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("../routes/authRoutes");
const courseRoutes = require("../routes/courseRoutes");
const chatroomRoute = require("../routes/chatroomRoutes");
const transcriptRoute = require("../routes/transcriptRoutes");
const emailRoute = require("../routes/emailRoutes");
const userRoutes = require("../routes/userRoutes");

const app = express();
const PORT = process.env.PORT_BACKEND || 4000;

// Basic middleware
app.use(express.json());
app.use(cookieParser());

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
}));

// Session configuration
app.use(
    session({
        name: 'connect.sid',
        secret: "CampusPlus",
        resave: true,
        saveUninitialized: false,
        rolling: true,
        cookie: {
            path: '/',
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            httpOnly: true,
            secure: false,
            sameSite: 'lax'
        }
    })
);

// Set CORS headers for all responses
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    next();
});

// Routes
app.use("/", authRoutes);
app.use("/user", userRoutes);
app.use("/Courses", courseRoutes);
app.use("/Chatrooms", chatroomRoute);
app.use("/Transcript", transcriptRoute);
app.use("/api/email", emailRoute);

// Test connection
app.get("/test", (req, res) => {
    res.send("Server is running and routes are registered!");
});

// Error handler
app.use((err, req, res, next) => {
    console.error("Error:", err.message);
    res.status(500).send("Server Error");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
