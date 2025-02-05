const express = require("express");
const session = require("express-session");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("../routes/authRoutes");
const courseRoutes = require("../routes/courseRoutes");
const chatroomRoute = require("../routes/chatroomRoutes");
const transcriptRoute = require("../routes/transcriptRoutes");

const app = express();
const PORT = process.env.PORT_BACKEND || 4000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(
  session({
    secret: "CampusPlus", // Use a strong secret
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 600000, // Session expiry (10 minutes)
      httpOnly: true,
      secure: false, // Set to true if using HTTPS
      sameSite: "lax", // Ensures cookies are sent with cross-origin requests
    },
  })
);

app.options("*", cors());

app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from this origin
    credentials: true, // Allow cookies and credentials
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
  })
);

// Routes
app.use("/", authRoutes);
app.use("/Courses", courseRoutes);
app.use("/Chatrooms", chatroomRoute);
app.use("/Transcript", transcriptRoute);

app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

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
