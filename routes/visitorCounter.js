const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const countFile = path.join(__dirname, "../visitor_count.txt");

const ipMap = {}; // Runtime memory tracking
const TIMEOUT_MS = 60 * 60 * 1000; // 1 hour

// Ensure file exists
if (!fs.existsSync(countFile)) fs.writeFileSync(countFile, "0");

function getClientIp(req) {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    "unknown"
  );
}

// GET current count
router.get("/api/visitor-count", (req, res) => {
  const count = parseInt(fs.readFileSync(countFile, "utf8")) || 0;
  res.json({ count });
});

// POST to maybe increment count
router.post("/api/visitor-count", (req, res) => {
  const ip = getClientIp(req);
  const now = Date.now();

  const lastVisit = ipMap[ip];
  const shouldIncrement = !lastVisit || now - lastVisit > TIMEOUT_MS;

  let count = parseInt(fs.readFileSync(countFile, "utf8")) || 0;

  if (shouldIncrement) {
    count += 1;
    fs.writeFileSync(countFile, count.toString());
    ipMap[ip] = now;
    console.log(`New visit from ${ip}. Updated count: ${count}`);
  } else {
    console.log(`Repeat visit from ${ip} — no increment.`);
  }

  res.json({ count });
});

module.exports = router;
