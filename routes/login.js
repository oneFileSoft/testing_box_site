const express = require('express');
const pool = require('../config/db');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username and password are required", userId: -1 });
  }

  try {
    const query = "SELECT * FROM users WHERE uName = ? AND uPass = ?";
    const [rows] = await pool.query(query, [username, password]);

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid username or password", userId: -1 });
    }
    return res.json({ success: true, message: "Login successful", userId: rows[0].id });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Login error", error: error.message, userId: -1 });
  }
});
module.exports = router;
