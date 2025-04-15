const express = require('express');
const pool = require('../config/db');
const router = express.Router();

router.post('/insertBuildReport', async (req, res) => {
  const { junit_rep, build_rep } = req.body;

  // Basic validation
  if (!junit_rep || !build_rep) {
    console.log("Validation failed: Missing fields");
    return res.status(400).json({
      success: false,
      message: "Both junit_rep and build_rep are required"
    });
  }

  try {
    const insertQuery = `
      INSERT INTO builds (junit_rep, build_rep)
      VALUES (?, ?)
    `;

    const values = [junit_rep, build_rep];
    const [result] = await pool.query(insertQuery, values);

    if (result.affectedRows === 1) {
      return res.status(200).json({
        success: true,
        message: "Build report inserted successfully!"
      });
    } else {
      console.error("Unexpected insert result:", result);
      return res.status(500).json({
        success: false,
        message: "Build report not inserted due to an unexpected issue."
      });
    }

  } catch (error) {
    console.error("Database insert error:", error);
    return res.status(500).json({
      success: false,
      message: "Error inserting build report into DB",
      error: error.message
    });
  }
});

module.exports = router;
