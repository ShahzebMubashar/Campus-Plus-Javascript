// const express = require("express");
// const session = require("express-session");
// const cors = require("cors");

const authRoutes = require("../routes/authRoutes");
const app = express();
const PORT = process.env.PORT_BACKEND || 4000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(
  session({
    secret: "CampusPlus",
    resave: false,
    saveUninitialized: true,
  })
);

// Routes
app.use("/", authRoutes);

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
