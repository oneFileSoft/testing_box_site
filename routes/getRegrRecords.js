const express = require('express');
const pool = require('../config/db');
const router = express.Router();

router.get('/getRegrRecords', async (req, res) => {
    const { date } = req.query;

    console.log(`[GET /getRegrRecords] date = ${date}`);

    if (!date) {
        console.log("❌ Validation failed: Missing date");
        return res.status(400).json({ success: false, message: "Date is required" });
    }

    try {
        const query = "SELECT * FROM regr WHERE DATE(created) = ?  ORDER BY buildId DESC";
//        const query = `SELECT id, buildId, created, html, consol,
//                    CASE
//                      WHEN status = TRUE THEN 'PASS'
//                      ELSE 'FAIL'
//                    END AS status
//                  FROM regr WHERE DATE(created) = ? `;

        const [records] = await pool.query(query, [date]);
        console.log(`✅ Builds query returned ${records.length} records`);

        return res.status(200).json({
            success: true,
            builds: records
        });

    } catch (error) {
        console.error("🔥 Error fetching builds:", error);
        return res.status(500).json({ success: false, message: "Error fetching builds", error: error.message });
    }
});

module.exports = router;
