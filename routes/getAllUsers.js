const express = require('express');
const pool = require('../config/db');
const router = express.Router();

router.post('/getAllUsers', async (req, res) => {
  try {

    console.log(req.method+ " " + req.url);

    const query = "SELECT id, uName FROM users";
    const [rows] = await pool.query(query);
    return res.json(rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ success: false, message: "Error fetching users", error: error.message });
  }
});

module.exports = router;

