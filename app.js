const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Import Routes
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const profileRoutes = require("./routes/profileRoutes");

// MongoDB connection
const mongoUrl = process.env.MONGODB_URL;
console.log("Connecting to:", mongoUrl);

mongoose.connect(mongoUrl)
  .then(() => {
    console.log("✅ MongoDB connected successfully...");
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error.message);
  });

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/profile", profileRoutes);

// Serve frontend in production (Render-compatible)
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/build");

  const fs = require("fs");
  if (fs.existsSync(frontendPath)) {
    app.use(express.static(frontendPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(frontendPath, "index.html"));
    });
  } else {
    console.log("⚠️ Frontend build folder not found, skipping static serve.");
  }
}

// Start server
const port = process.env.PORT || 5000;
console.log("About to start backend server...");
app.listen(port, () => {
  console.log(`✅ Backend is running on port ${port}`);
});
