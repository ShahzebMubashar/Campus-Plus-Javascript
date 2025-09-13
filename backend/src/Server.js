const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

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
const notificationRoutes = require("../routes/notificationRoutes");
const csvRoutes = require("../routes/csvRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

app.set('trust proxy', 1);

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  next();
});

const corsOrigin = process.env.NODE_ENV === "production" 
  ? process.env.FRONTEND_URL || "https://campus-plus-javascript.vercel.app"
  : "http://localhost:3000";


app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'campus-plus-backend' 
  });
});

// Connection cleanup endpoint (for manual cleanup if needed)
app.post('/cleanup-connections', async (req, res) => {
  try {
    const client = await pool.connect();
    
    // Get connection stats before cleanup
    const beforeStats = await client.query(`
      SELECT 
        count(*) as total_connections,
        count(*) FILTER (WHERE state = 'idle') as idle_connections,
        count(*) FILTER (WHERE state = 'active') as active_connections
      FROM pg_stat_activity 
      WHERE datname = current_database()
    `);
    
    // Get maximum connections allowed
    const maxConnections = await client.query(`
      SELECT setting::int as max_connections 
      FROM pg_settings 
      WHERE name = 'max_connections'
    `);
    
    // Kill idle connections (except current one)
    const killResult = await client.query(`
      SELECT pg_terminate_backend(pid) as killed_connections
      FROM pg_stat_activity 
      WHERE state = 'idle' 
      AND pid <> pg_backend_pid()
      AND usename = 'avnadmin'
      AND state_change < NOW() - INTERVAL '5 minutes'
    `).catch(error => {
      console.error('Error killing idle connections:', error);
      return { rowCount: 0 };
    });
    
    // Get connection stats after cleanup
    const afterStats = await client.query(`
      SELECT 
        count(*) as total_connections,
        count(*) FILTER (WHERE state = 'idle') as idle_connections,
        count(*) FILTER (WHERE state = 'active') as active_connections
      FROM pg_stat_activity 
      WHERE datname = current_database()
    `);
    
    // Calculate usage percentage
    const maxConn = maxConnections.rows[0].max_connections;
    const beforeUsage = Math.round((beforeStats.rows[0].total_connections / maxConn) * 100);
    const afterUsage = Math.round((afterStats.rows[0].total_connections / maxConn) * 100);
    
    client.release();
    
    res.status(200).json({
      message: 'Connection cleanup completed',
      max_connections_allowed: maxConn,
      before: {
        ...beforeStats.rows[0],
        usage_percentage: beforeUsage
      },
      after: {
        ...afterStats.rows[0],
        usage_percentage: afterUsage
      },
      killed_count: killResult.rowCount,
      improvement: {
        connections_freed: beforeStats.rows[0].total_connections - afterStats.rows[0].total_connections,
        usage_reduction: beforeUsage - afterUsage
      }
    });
    
  } catch (error) {
    console.error('Connection cleanup error:', error);
    res.status(500).json({ error: 'Cleanup failed', message: error.message });
  }
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

app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/Courses", courseRoutes);
app.use("/Chatrooms", chatroomRoute);
app.use("/Transcripts", transcriptRoute);
app.use("/api/email", emailRoute);
app.use("/notifications", notificationRoutes);
app.use("/api/csv", csvRoutes);

app.get("/test", (req, res) => {
  res.send("Server is running and routes are registered!");
});

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).send("Server Error");
});

app.listen(PORT, '0.0.0.0', () => {
});
