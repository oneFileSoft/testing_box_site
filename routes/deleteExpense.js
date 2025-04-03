const express = require('express');
const pool = require('../config/db');
const router = express.Router();

router.delete('/deleteExpense', async (req, res) => {
    const { userId, expenseId } = req.body;

    // Validate input parameters
    if (!userId || !expenseId) {
        console.log("Validation failed: Missing userId or expenseId");
        return res.status(400).json({ success: false, message: "userId and expenseId are required" });
    }

    try {
        // Check if the expense exists and belongs to the user
        const checkQuery = "SELECT * FROM expenses WHERE id = ? AND userId = ?";
        const [rows] = await pool.query(checkQuery, [expenseId, userId]);

        if (rows.length === 0) {
            console.log("Expense not found or does not belong to user");
            return res.status(404).json({ success: false, message: "Expense not found or unauthorized" });
        }

        // Delete the expense
        const deleteQuery = "DELETE FROM expenses WHERE id = ?";
        await pool.query(deleteQuery, [expenseId]);

        return res.status(200).json({ success: true, message: "Expense deleted successfully" });
    } catch (error) {
        console.error("Error deleting expense:", error);
        return res.status(500).json({ success: false, message: "Error deleting expense", error: error.message });
    }
});

module.exports = router;
