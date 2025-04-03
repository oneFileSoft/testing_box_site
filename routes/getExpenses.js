const express = require('express');
const pool = require('../config/db');
const router = express.Router();

router.get('/getExpenses', async (req, res) => {
    const { userId } = req.query;

    // Validate userId parameter
    if (!userId) {
        console.log("Validation failed: Missing userId");
        return res.status(400).json({ success: false, message: "userId is required" });
    }

    try {
        // Check if the user exists
        const query = "SELECT * FROM users WHERE id = ?";
        const [rows] = await pool.query(query, [userId]);

        if (rows.length === 0) {
            console.log("User not found");
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Get expenses for the user
        const expenseQuery = "SELECT * FROM expenses WHERE userId = ? ORDER BY transDate DESC";
        const [expenses] = await pool.query(expenseQuery, [userId]);

        return res.status(200).json({
            success: true,
            expenses: expenses
        });

    } catch (error) {
        console.error("Error fetching expenses:", error);
        return res.status(500).json({ success: false, message: "Error fetching expenses", error: error.message });
    }
});

module.exports = router;
