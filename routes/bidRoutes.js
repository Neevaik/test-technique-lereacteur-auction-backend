const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.post("/", async (req, res) => {
  const { auctionId, bidderId, amount } = req.body;

  try {
    const insertResult = await pool.query(
      "INSERT INTO bids (amount, auction_id, bidder_id) VALUES ($1, $2, $3) RETURNING *",
      [amount, auctionId, bidderId]
    );

    await pool.query(
      "UPDATE auctions SET current_price = $1 WHERE id = $2",
      [amount, auctionId]
    );

    res.json({ message: "Mise enregistrée", bid: insertResult.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
