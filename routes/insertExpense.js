const express = require('express');
const pool = require('../config/db');
const router = express.Router();


router.post('/insertExpense', async (req, res) => {
  const { userId, transDescr, transTotal, transDate } = req.body;

    if (!userId || !transDescr || !transTotal || !transDate) {
        console.log("Validation failed");
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const query = "SELECT * FROM users WHERE id = ?";
        const [rows] = await pool.query(query, [userId]);
    
        if (rows.length === 0) {
            console.log("User not found");
            return res.status(404).json({ success: false, message: "User not found" });
        }

        try {    
            const insertQuery = "INSERT INTO expenses (userId, transDescr, transTotal, transDate) VALUES (?, ?, ?, ?)";
            const values = [userId, transDescr, parseFloat(transTotal), new Date(transDate)];  
            const [result] = await pool.query(insertQuery, values);
        
            if (result.affectedRows === 1) {
                return res.status(200).json({ success: true, message: "User expenses inserted successfully!" });
            } else {
                console.error("Unexpected insert result:", result);
                return res.status(500).json({ success: false, message: "User expenses not inserted due to an unexpected issue." });
            }
        } catch (error) {
            console.error("Database insert error:", error);  
            return res.status(500).json({ success: false, message: "Error inserting user expences to DB", error: error.message });
        }
    
    } catch (error) {
        console.error("User check error:", error); 
        return res.status(500).json({ success: false, message: "Error inserting expenses user", error: error.message });
    }
  }
);
module.exports = router;

