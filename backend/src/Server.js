const express = require("express");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const cors = require("cors");
const cookieParser = require("cookie-parser");
const pool = require("../config/database");
const nodemailer = require("nodemailer");
const passport = require("../config/passport");


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

const app = express();
const PORT = process.env.PORT || 4000;

// Basic middleware
app.use(express.json());
app.use(cookieParser());

// Ensure cookies are handled properly for cross-origin requests
app.use((req, res, next) => {
  // Log all cookies for debugging
  console.log("Request cookies:", req.headers.cookie);
  console.log("Request origin:", req.headers.origin);
  next();
});

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        process.env.FRONTEND_URL || "https://campus-plus-javascript.vercel.app",
        "http://localhost:3000",
        "https://campus-plus-javascript.vercel.app"
      ];
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log("CORS blocked origin:", origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With"],
    exposedHeaders: ["Set-Cookie"],
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
);

// Health check endpoint for Koyeb
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'campus-plus-backend' 
  });
});

app.post('/api/email/send-email', async (req, res) => {
  const { name, email, phone, message } = req.body;
  const transporter = nodemailer.createTransporter({
    service: 'Gmail',
    auth: {
      user: "productionsbymultidexters@gmail.com",
      pass: "vnfm sfwx dluo bkez",
    }
  });

  const mailOptions = {
    from: email,
    to: 'productionsbymultidexters@gmail.com',
    subject: `New Contact Form Submission from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ message: 'Email failed to send' });
  }
});


// CORS is already configured above with the cors middleware

// Session configuration
const sessionStore = new pgSession({
  pool: pool,
  tableName: 'user_sessions',
  createTableIfMissing: true
});

// Add error handling for session store
sessionStore.on('error', (err) => {
  console.error('Session store error:', err);
});

app.use(
  session({
    store: sessionStore,
    name: "connect.sid",
    secret: process.env.SESSION_SECRET || "CampusPlus",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      path: "/",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: false, // Allow JS access for debugging
      secure: true, // MUST be true for sameSite: "none"
      sameSite: "none", // Required for cross-origin
    },
    proxy: true,
  })
);

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());

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

// Debug endpoint to check session
app.get("/debug/session", (req, res) => {
  console.log("=== DEBUG SESSION ENDPOINT ===");
  console.log("Session ID:", req.sessionID);
  console.log("Cookies received:", req.headers.cookie);
  console.log("Full session object:", JSON.stringify(req.session, null, 2));
  console.log("Session user:", req.session?.user);
  console.log("req.user (Passport):", req.user);
  console.log("isAuthenticated():", req.isAuthenticated ? req.isAuthenticated() : 'N/A');
  console.log("=== END DEBUG ===");
  
  res.json({
    sessionID: req.sessionID,
    session: req.session,
    isAuthenticated: req.isAuthenticated ? req.isAuthenticated() : false,
    user: req.user || null,
    sessionUser: req.session?.user || null,
    cookiesReceived: req.headers.cookie
  });
});

// Test endpoint to manually set a cookie
app.get("/debug/set-cookie", (req, res) => {
  console.log("=== SETTING TEST COOKIE ===");
  
  // Set a test cookie with same settings as session
  res.cookie('test-cookie', 'test-value', {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: false,
    secure: true,
    sameSite: 'none',
    path: '/'
  });
  
  // Also manually set session data
  req.session.testData = 'manual-test-data';
  
  res.json({
    message: 'Test cookie and session data set',
    sessionID: req.sessionID,
    sessionData: req.session
  });
});

app.get("/Chatrooms/messages/:roomid", chatroomController.getRoomMessages); // Call controller's function
app.post("/Chatrooms/like/:messageid", chatroomController.likePost); // Like a post
app.get("/Chatrooms/likes/:messageid", chatroomController.getLikeCount); // Get like count for a post

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).send("Server Error");
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
