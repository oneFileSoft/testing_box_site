const express = require('express');
const pool = require('../config/db');
const router = express.Router();

router.post('/insertBuildReport', async (req, res) => {
  const { buildNumber, htmlContent, consoleLog } = req.body;

  // Basic validation
  if (!buildNumber || !htmlContent || !consoleLog) {
    let err = "";
        if (!buildNumber) {
           err = "buildNumber"
        }
        if (!htmlContent) {
           err += ", htmlContent"
        }
        if (!consoleLog) {
           err = ", consoleLog"
        }
    console.log("Validation failed: " + err + " is/are EMPTY!");
    return res.status(400).json({
      success: false,
      message: "Both buildNumber, htmlContent and consoleLog are required"
    });
  }

  try {
    const insertQuery = `INSERT INTO bulds (buildNumb, htmlRep, consolRep) VALUES (?, ?, ?)`;

    const values = [buildNumber, htmlContent, consoleLog];
    const [result] = await pool.query(insertQuery, values);

    if (result.affectedRows === 1) {
      return res.status(200).json({
        success: true,
        message: "Build# " + buildNumber + " report inserted successfully!"
      });
    } else {
      console.error("Unexpected insert result:", result);
      return res.status(500).json({
        success: false,
        message: "Build report " + buildNumber + " not inserted due to an unexpected issue."
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
