const pool = require("../config/db.js");
const bcrypt = require("bcrypt");

async function findUserByPseudo(pseudo) {
  const result = await pool.query("SELECT * FROM users WHERE pseudo = $1", [pseudo]);
  return result.rows[0]; 
}

async function createUser(pseudo, hashedPassword) {
  const result = await pool.query(
    "INSERT INTO users (pseudo, password) VALUES ($1, $2) RETURNING *",
    [pseudo, hashedPassword]
  );
  return result.rows[0];
}

async function login(req, res) {
  const { pseudo, password } = req.body;

  try {
    let user = await findUserByPseudo(pseudo);

    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await createUser(pseudo, hashedPassword);
    } else {
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    res.cookie("userId", user.id, {
      httpOnly: true,
      secure: false, 
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Connexion réussie", userId: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

module.exports = { login };
