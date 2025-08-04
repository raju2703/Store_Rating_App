// routes/user.js
const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../config/db");

const router = express.Router();

router.put("/:id/update-password", async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);
    await db.query("UPDATE users SET password = ? WHERE id = ?", [hashed, id]);
    res.json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("Password update error:", err);
    res.status(500).json({ message: "Failed to update password." });
  }
});

module.exports = router;
