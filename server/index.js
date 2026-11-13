require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const itemsRouter = require("./routes/items");
const notificationsRouter = require("./routes/notifications");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/campus_connect";

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Routes
app.use("/api/items", itemsRouter);
app.use("/api/notifications", notificationsRouter);

// Health check
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// Connect to MongoDB then start server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(`✅ Connected to MongoDB at ${MONGO_URI}`);
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
