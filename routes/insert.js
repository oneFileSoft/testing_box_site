const express = require('express');
const pool = require('../config/db');
const router = express.Router();

router.post('/insert', async (req, res) => {
  const { username, password, dbKey } = req.body;

  if (!username || !password || !dbKey) {
    return res.status(400).json({ success: false, message: "Username, password and SecureKey are required" });
  }

  if (String(dbKey).trim() !== "fwIeojc9PzArd6hOe+NQ2zFDxr94I0N/TcgmkTKzrTGhmRrGexdLdcz8KKRQYtYZyemXoSpPU3ljq0bciyXSHw==") {
    return res.status(500).json({ success: false, message: "SecureKey does not match" });
  }

  try {
    const query = "SELECT * FROM users WHERE uName = ?";
    const [rows] = await pool.query(query, [username]);

    if (rows.length === 0) {
      try {
        const insertQuery = "INSERT INTO users (uName, uPass) VALUES (?, ?)";
        const values = [username, password];
        const [result] = await pool.query(insertQuery, values);

        if (result.affectedRows === 1) {
          return res.status(200).json({ success: true, message: "User inserted successfully!" });
        } else {
          console.error("Unexpected insert result:", result);
          return res.status(500).json({ success: false, message: "User not inserted due to an unexpected issue." });
        }
      } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ success: false, message: "Username already exists." });
        }
        console.error("Database insert error:", error);
        return res.status(500).json({ success: false, message: "Error inserting user to DB", error: error.message });
      }
    } else {
      return res.status(409).json({ success: false, message: "Username already exists." });
    }
  } catch (error) {
    console.error("User check error:", error);
    return res.status(500).json({ success: false, message: "Error checking for existing user", error: error.message });
  }
});

module.exports = router;
