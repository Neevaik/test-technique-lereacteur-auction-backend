const pool = require("../config/db.js");

async function createUser(pseudo, password) {
  const res = await pool.query(
    "INSERT INTO users (pseudo, password) VALUES ($1, $2) RETURNING *",
    [pseudo, password]
  );
  return res.rows[0];
}

async function findUserByPseudo(pseudo) {
  const res = await pool.query("SELECT * FROM users WHERE pseudo = $1", [pseudo]);
  return res.rows[0];
}

module.exports = { createUser, findUserByPseudo };