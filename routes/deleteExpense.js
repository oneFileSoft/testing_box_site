const express = require('express');
const pool = require('../config/db');
const router = express.Router();

router.delete('/deleteExpense', async (req, res) => {
    const { userId, expenseId, transDescr, deleteAll } = req.body;
    // Validate input parameters
    if (!userId && !deleteAll) {
        console.log("Validation failed: Missing userId or deleteAll");
        return res.status(400).json({ success: false, message: "userId is required" });
    }

    try {
        // Check if the expense exists and belongs to the user
          let deleteQuery = '';
          let params = [];

          if (expenseId) {
                const checkQuery = "SELECT * FROM expenses WHERE id = ? AND userId = ?";
                const [rows] = await pool.query(checkQuery, [expenseId, userId]);

                if (rows.length === 0) {
                    console.log("Expense not found or does not belong to user");
                    return res.status(404).json({ success: false, message: "Expense: "
                         + expenseId +" not found or unauthorized for this User" });
                }
            deleteQuery = "DELETE FROM expenses WHERE userId = ? AND id = ?";
            params = [userId, expenseId];
          } else if (transDescr) {
            deleteQuery = "DELETE FROM expenses WHERE userId = ? AND transDescr = ?";
            params = [userId, transDescr];
          } else if (deleteAll === true) {
            // Hardcoded values: delete all for userId = 46 except 1 record
            deleteQuery = "DELETE FROM expenses WHERE userId = 46 AND transDescr <> ?";
            params = ['descriptions 1 for Test'];
          } else {
              return res.status(400).json({
              success: false,
              message: "Either expenseId or transDescr must be provided"
            });
          }

        // Delete the expense
        await pool.query(deleteQuery, params);

        return res.status(200).json({ success: true, message: "Expense deleted successfully" });
    } catch (error) {
        console.error("Error deleting expense:", error);
        return res.status(500).json({ success: false, message: "Error deleting expense", error: error.message });
    }
});

module.exports = router;
