const express = require("express");
const session = require("express-session");
const cors = require("cors");
const pool = require("../config/database");  // Adjust the path if needed


const authRoutes = require("../routes/authRoutes");
const courseRoutes = require("../routes/courseRoutes");
const app = express();
const PORT = process.env.PORT_BACKEND || 4000;

// Middleware
app.use(express.json());
app.use(cors());
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
    credentials: true,              // Allow cookies and credentials
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
  })
);

// Routes
app.use("/", authRoutes);
app.use("/api/courses", courseRoutes);

app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

// Test connection
app.get("/test", (req, res) => {
  res.send("Server is running and routes are registered!");
});

app.get("/api/past-papers/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT file_data, file_name FROM past_papers WHERE id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Paper not found" });
    }

    const { file_data, file_name } = result.rows[0];

    // Set the appropriate content-type for PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${file_name}"`);

    // Send the PDF file as the response
    res.send(file_data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch past paper" });
  }
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
