const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.id, a.title, a.current_price, a.status, c.name AS category
       FROM auctions a
       JOIN categories c ON a.category_id = c.id`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT a.id, a.title, a.description, a.starting_price, a.current_price, a.status, c.name AS category
       FROM auctions a
       JOIN categories c ON a.category_id = c.id
       WHERE a.id = $1`,
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "Enchère introuvable" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
