const router = require("express").Router();
const db = require("../config/db");

// Submit/update rating
router.post("/", async (req, res) => {
  const { userId, storeId, rating } = req.body;

  const [existing] = await db.query(
    "SELECT id FROM ratings WHERE user_id = ? AND store_id = ?",
    [userId, storeId]
  );

  if (existing.length > 0) {
    await db.query(
      "UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?",
      [rating, userId, storeId]
    );
  } else {
    await db.query(
      "INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)",
      [userId, storeId, rating]
    );
  }

  res.json({ message: "Rating submitted" });
});

// Get user's own ratings
router.get("/user/:userId", async (req, res) => {
  const [rows] = await db.query(
    "SELECT store_id, rating FROM ratings WHERE user_id = ?",
    [req.params.userId]
  );
  res.json(rows);
});

module.exports = router;
