const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Create new store by owner or admin
router.post("/create", async (req, res) => {
  const { name, address, owner_id } = req.body;

  if (!name || !address || !owner_id) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    // Check if the owner exists and is either 'owner' or 'admin'
    const [ownerRows] = await db.query("SELECT role FROM users WHERE id = ?", [owner_id]);

    if (ownerRows.length === 0) {
      return res.status(404).json({ message: "Owner not found" });
    }

    const role = ownerRows[0].role;
    if (!["admin", "owner"].includes(role)) {
      return res.status(403).json({ message: "Unauthorized: Not an admin or store owner" });
    }

    // Insert store
    await db.query(
      "INSERT INTO stores (name, address, owner_id) VALUES (?, ?, ?)",
      [name, address, owner_id]
    );

    res.status(201).json({ message: "Store created successfully" });
  } catch (err) {
    console.error("Error creating store:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
