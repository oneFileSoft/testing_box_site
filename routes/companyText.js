// routes/companyText.js

const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// ─── Configuration ────────────────────────────────────────────────────────────
// Adjust this path if your company.txt lives somewhere else
const COMPANY_TXT_PATH = path.join(__dirname, '..', 'company.txt');

// In‐process queue/lock to serialize writes
let writeInProgress = false;
const writeQueue = [];

/**
 * Enqueue a function that returns a Promise. Ensures only one write runs at a time.
 * Each queued function must call its own resolve() once it completes (success or failure).
 */
function enqueueWrite(fn) {
  if (!writeInProgress) {
    writeInProgress = true;
    fn().finally(() => {
      writeInProgress = false;
      if (writeQueue.length > 0) {
        const nextFn = writeQueue.shift();
        enqueueWrite(nextFn);
      }
    });
  } else {
    writeQueue.push(fn);
  }
}

/**
 * Atomically write newText to fullPath by first writing to a temp file
 * and then renaming. Returns a Promise that resolves on success.
 */
function atomicWriteFile(fullPath, newText) {
  return new Promise((resolve, reject) => {
    const tempPath = `${fullPath}.${Date.now()}.tmp`;
    fs.writeFile(tempPath, newText, 'utf8', (err) => {
      if (err) {
        // Clean up temp if write fails
        fs.unlink(tempPath, () => {});
        return reject(err);
      }
      fs.rename(tempPath, fullPath, (renameErr) => {
        if (renameErr) {
          fs.unlink(tempPath, () => {});
          return reject(renameErr);
        }
        resolve();
      });
    });
  });
}

/**
 * GET /api/company-text
 *   → Reads company.txt, returns JSON: { success: true, text, version }
 *   version = file’s last‐modified timestamp (mtimeMs). If file doesn’t exist, version = 0.
 */
router.get('/company-text', (req, res) => {
  fs.stat(COMPANY_TXT_PATH, (statErr, stats) => {
    if (statErr && statErr.code !== 'ENOENT') {
      console.error('Error stating company.txt:', statErr);
      return res.status(500).json({ success: false, message: 'Cannot stat file.' });
    }

    let serverVersion = 0;
    if (!statErr && stats) {
      serverVersion = stats.mtimeMs;
    }

    fs.readFile(COMPANY_TXT_PATH, 'utf8', (readErr, data) => {
      if (readErr && readErr.code !== 'ENOENT') {
        console.error('Error reading company.txt:', readErr);
        return res.status(500).json({ success: false, message: 'Cannot read file.' });
      }
      // If file doesn’t exist, treat as empty string
      const text = (readErr && readErr.code === 'ENOENT') ? '' : data;
      return res.json({ success: true, text, version: serverVersion });
    });
  });
});

/**
 * POST /api/company-text
 *   Body: { text: string, clientVersion: number }
 *
 *   - If clientVersion !== current mtimeMs → respond 409 Conflict with latest { text, version }.
 *   - Otherwise enqueue an atomic write, then respond { success: true, version: NEW_MTIME }.
 */
router.post('/company-text', (req, res) => {
  const newText = typeof req.body.text === 'string' ? req.body.text : '';
  const clientVersion = typeof req.body.clientVersion === 'number' ? req.body.clientVersion : 0;

  // Enqueue the entire “stat → version check → write” procedure
  enqueueWrite(() => {
    return new Promise((resolve) => {
      // 1) Check file’s current version
      fs.stat(COMPANY_TXT_PATH, (statErr, stats) => {
        let serverVersion = 0;
        if (!statErr && stats) {
          serverVersion = stats.mtimeMs;
        } else if (statErr && statErr.code !== 'ENOENT') {
          console.error('Error stating company.txt:', statErr);
          res.status(500).json({ success: false, message: 'Cannot stat file.' });
          return resolve();
        }

        // 2) If versions differ, read latest text and respond with 409 Conflict
        if (serverVersion !== clientVersion) {
          fs.readFile(COMPANY_TXT_PATH, 'utf8', (readErr, data) => {
            const latestText = (readErr && readErr.code === 'ENOENT') ? '' : data || '';
            res.status(409).json({
              success: false,
              message: 'Conflict – file has changed since you loaded it.',
              text: latestText,
              version: serverVersion,
            });
            return resolve();
          });
        } else {
          // 3) Versions match → perform atomic write
          atomicWriteFile(COMPANY_TXT_PATH, newText)
            .then(() => {
              // 4) After successful write, re‐stat to get new mtimeMs
              fs.stat(COMPANY_TXT_PATH, (finalStatErr, finalStats) => {
                const newVersion = (!finalStatErr && finalStats)
                  ? finalStats.mtimeMs
                  : Date.now();
                res.json({ success: true, version: newVersion });
                return resolve();
              });
            })
            .catch((writeErr) => {
              console.error('Error writing company.txt:', writeErr);
              res.status(500).json({ success: false, message: 'Write failed.' });
              return resolve();
            });
        }
      });
    });
  });
});

module.exports = router;
