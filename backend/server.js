// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./config/db");
const createTables = require("./config/initDB");

dotenv.config();

const app = express();

// ✅ CORS config for Vite dev server
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// ✅ Import routes
const authRoutes = require("./routes/auth");
const ownerRoutes = require("./routes/owner.js");
const userRoutes = require("./routes/user.js");

// ✅ Use routes
app.use("/api/auth", authRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/user", userRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("🚀 Server is running!");
});

// DB test route
app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS result");
    res.json({ result: rows[0].result });
  } catch (err) {
    console.error("DB Test Error:", err);
    res.status(500).json({ message: "DB error" });
  }
});

// ✅ Initialize DB tables
createTables();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
