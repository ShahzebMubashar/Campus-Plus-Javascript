const express = require("express");
const session = require("express-session");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const pool = require("../config/database");
const nodemailer = require("nodemailer");


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
const PORT = process.env.PORT_BACKEND || 4000;

// Basic middleware
app.use(express.json());
app.use(cookieParser());

// CORS configuration
app.use(
  cors({
    origin: process.env.NODE_ENV === "production"
      ? [process.env.FRONTEND_URL || "https://your-frontend-app.railway.app", "http://localhost:3000"]
      : "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  })
);

app.post('/api/email/send-email', async (req, res) => {
  const { name, email, phone, message } = req.body;
  const transporter = nodemailer.createTransport({
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


// Set CORS headers for all responses
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  next();
});

// Session configuration
app.use(
  session({
    name: "connect.sid",
    secret: "CampusPlus",
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
  })
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

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).send("Server Error");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
