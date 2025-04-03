const express = require('express');
const pool = require('../config/db');
const router = express.Router();

router.post('/transactions', async (req, res) => {
    const { beginDate, endDate, userIds } = req.body;

    if (!beginDate ) {
        console.log("Validation failed: Missing parameters");
        return res.status(400).json({ success: false, message: "beginDate, endDate, and userIds are required!!!!!" });
    }
        if (!endDate) {
            console.log("Validation failed: Missing parameters");
            return res.status(400).json({ success: false, message: "beginDate is  required" });
        }

            if (!userIds) {
                console.log("Validation failed: Missing parameters");
                return res.status(400).json({ success: false, message: "userIds are required" });
            }
    const userIdArray = Array.isArray(userIds) ? userIds : [];

    if (userIdArray.length === 0) {
        console.log("Validation failed: Invalid userIds");
        return res.status(400).json({ success: false, message: "Invalid userIds format" });
    }
//    const userIdArray = userIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));

    if (userIdArray.length === 0) {
        console.log("Validation failed: Invalid userIds");
        return res.status(400).json({ success: false, message: "Invalid userIds format" });
    }

    try {
        const sql = `
            SELECT
                u.uName AS userName,
                e.transDate,
                e.transTotal AS transAmount,
                e.transDescr,
                (SELECT SUM(e2.transTotal)
                 FROM expenses e2
                 WHERE e2.userId = e.userId
                   AND e2.transDate BETWEEN ? AND ?) AS total_for_the_period
            FROM expenses e
            JOIN users u ON u.id = e.userId
            WHERE e.transDate BETWEEN ? AND ?
              AND e.userId IN (${userIdArray.map(() => '?').join(',')})
            ORDER BY e.userId, e.transDate;
        `;

        const values = [beginDate, endDate, beginDate, endDate, ...userIdArray];

        const [results] = await pool.query(sql, values);

        return res.status(200).json({ success: true, data: results });
    } catch (error) {
        console.error("Database query error:", error);
        return res.status(500).json({ success: false, message: "Error fetching transactions", error: error.message });
    }
});

module.exports = router;
