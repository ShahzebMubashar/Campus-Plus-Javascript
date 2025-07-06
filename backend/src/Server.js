const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const pool = require("../config/database");
const nodemailer = require("nodemailer");
const passport = require("../config/passport");

const authRoutes = require("../routes/authRoutes");
const courseRoutes = require("../routes/courseRoutes");
const chatroomRoute = require("../routes/chatroomRoutes");
const transcriptRoute = require("../routes/transcriptRoutes");
const emailRoute = require("../routes/emailRoutes");
const userRoutes = require("../routes/userRoutes");
const chatroomController = require("../controllers/chatroomController");

const app = express();
const PORT = process.env.PORT || 4000;

// Trust proxy - Required for secure cookies behind a proxy like Koyeb
app.set('trust proxy', 1);

// Basic middleware
app.use(express.json());
app.use(cookieParser());

// Basic request logging
app.use((req, res, next) => {
  console.log(`\n=== ${req.method} ${req.path} ===`);
  console.log("Request origin:", req.headers.origin);
  console.log("Authorization header:", req.headers.authorization ? "EXISTS" : "NONE");
  next();
});

// CORS configuration
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" 
      ? process.env.FRONTEND_URL || "https://campus-plus-javascript.vercel.app"
      : "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
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

// Initialize Passport for OAuth
app.use(passport.initialize());

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

app.get("/Chatrooms/messages/:roomid", chatroomController.getRoomMessages);
app.post("/Chatrooms/like/:messageid", chatroomController.likePost);
app.get("/Chatrooms/likes/:messageid", chatroomController.getLikeCount);

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).send("Server Error");
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
