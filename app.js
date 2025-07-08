const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const profileRoutes = require("./routes/profileRoutes");

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
const mongoUrl = process.env.MONGODB_URL;
console.log("Connecting to:", mongoUrl);

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected successfully"))
.catch(err => {
  console.error("MongoDB connection failed:", err.message);
  process.exit(1);
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/profile", profileRoutes);

// Serve frontend only if build folder exists
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/build");
  
  const fs = require("fs");
  if (fs.existsSync(frontendPath)) {
    app.use(express.static(frontendPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(frontendPath, "index.html"));
    });
  } else {
    console.warn("Frontend build folder not found, skipping static serve.");
  }
}

// Start server
const port = process.env.PORT || 5000;
console.log("About to start backend server...");
app.listen(port, () => {
  console.log(`✅ Backend is running on port ${port}`);
});
