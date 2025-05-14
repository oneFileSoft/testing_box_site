const express = require('express');
const pool = require('../config/db');
const router = express.Router();

router.post('/insertRegrReport', async (req, res) => {
  const { buildId, status, html, consol, jmeterreport } = req.body;

  // Basic validation
  if (!buildId || typeof status !== 'boolean' || !html || !consol) {
    let err = [];
    if (!buildId) err.push("buildId");
    if (typeof status !== 'boolean') err.push("status (not boolean)");
    if (!html) err.push("html");
    if (!consol) err.push("consol");

    return res.status(400).json({
      success: false,
      message: "Validation failed: " + err.join(', ') + " is/are EMPTY or INVALID!"
    });
  }

  try {
    // Decode Base64 into binary buffer (but still gzipped)
    const htmlBuffer = Buffer.from(html, 'base64');
    const consolBuffer = Buffer.from(consol, 'base64');
    const jmeterBuffer = Buffer.from(jmeterreport, 'base64');

    const insertQuery = `INSERT INTO regr (buildId, status, html, consol, jmeterBuffer) VALUES (?, ?, ?, ?)`;
    const values = [buildId, status, htmlBuffer, consolBuffer, jmeterBuffer];
    const [result] = await pool.query(insertQuery, values);

    if (result.affectedRows === 1) {
      return res.status(200).json({
        success: true,
        message: `Build# ${buildId} report inserted successfully!`
      });
    } else {
      console.error("Unexpected insert result:", result);
      return res.status(500).json({
        success: false,
        message: `Build report ${buildId} not inserted due to an unexpected issue.`
      });
    }

  } catch (error) {
 let statusCode = 500;
  let userMessage = `Error inserting ${buildId} report into DB`;

  // Detect specific known DB errors
  if (error.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    userMessage = `Build report with ID ${buildId} already exists.`;
  } else if (error.code === 'ER_BAD_NULL_ERROR') {
    statusCode = 400;
    userMessage = `Missing required DB field for ${buildId}`;
  }
  return res.status(statusCode).json({
    success: false,
    message: userMessage + " Error-Message: " + error.message
  });
  }
});

module.exports = router;
