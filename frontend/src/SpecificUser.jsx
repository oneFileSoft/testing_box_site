// src/SpecificUser.jsx

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./App.css";

export default function SpecificUser() {
  const navigate = useNavigate();

  // ─── State Hooks ────────────────────────────────────────────────────────────
  const [textValue, setTextValue] = useState("");
  const [fileVersion, setFileVersion] = useState(0);  // mtimeMs from server
  const [loading, setLoading] = useState(true);       // true while GET is in progress
  const [saving, setSaving] = useState(false);        // true while POST is in progress
  const [error, setError] = useState(null);           // any error or conflict message
  const [showReload, setShowReload] = useState(false);// whether to show “Reload” button

  // ─── A reusable function to fetch latest text & version from server ───────
  const fetchCompanyText = useCallback(async () => {
    setError(null);
    setShowReload(false);
    setLoading(true);

    try {
      const res = await axios.get("/api/company-text");
      if (res.data.success) {
        setTextValue(res.data.text);
        setFileVersion(res.data.version);
      } else {
        setError("Failed to load data from server.");
      }
    } catch (err) {
      console.error("GET /api/company-text error:", err);
      setError("Error loading data.");
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── 1) On mount, fetch the initial data ────────────────────────────────────
  useEffect(() => {
    fetchCompanyText();
  }, [fetchCompanyText]);

  // ─── 2) Handle “Save” click (POST with version check) ────────────────────────
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setShowReload(false);

    try {
      const payload = {
        text: textValue,
        clientVersion: fileVersion,
      };

      const res = await axios.post("/api/company-text", payload);
      if (res.data.success) {
        // Successfully saved; navigate away
        setFileVersion(res.data.version);
        sessionStorage.clear();
        navigate("/");
      } else {
        // Unlikely without a 409, but just in case:
        setError("Save failed. Please try again.");
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        // Conflict detected
        const { text: latestText, version: latestVersion } = err.response.data;
        setError(
          "Conflict: The file changed on the server."
        );
        // Pre-fill with the server’s latest content so user can see it
        setTextValue(latestText);
        setFileVersion(latestVersion);
        setShowReload(true); // show the Reload button
      } else {
        console.error("POST /api/company-text error:", err);
        setError("Error saving data.");
      }
    } finally {
      setSaving(false);
    }
  };

  // ─── 3) Handle “Reload” click, to re-fetch latest text from server ─────────
  const handleReload = async () => {
    await fetchCompanyText();
    setError(null);
    setShowReload(false);
  };

  // ─── 4) Handle “Cancel” click ───────────────────────────────────────────────
  const handleCancel = () => {
    sessionStorage.clear();
    navigate("/");
  };

  // ─── 5) Render ───────────────────────────────────────────────────────────────
  return (
    <div className="specific-user-page">
      <div className="form-card">
        <h2 className="form-title">Specific User Details</h2>

        {loading ? (
          <p style={{ textAlign: "center", margin: "24px 0" }}>Loading…</p>
        ) : (
          <>
            <textarea
              className="input-area"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder="Enter your text here..."
            />

            {/* Show any error or conflict message */}
            {error && <p className="error-msg">{error}</p>}

            {/* Show Reload button only if a conflict occurred */}
            {showReload && (
              <div style={{ textAlign: "center", marginBottom: "12px" }}>
                <button
                  className="btn-reload"
                  onClick={handleReload}
                  disabled={loading}
                  style={{
                    padding: "8px 16px",
                    fontSize: "1rem",
                    backgroundColor: "#f59e0b", // amber-500
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Reload Latest
                </button>
              </div>
            )}

            <div className="form-actions">
              <button
                className="btn-cancel"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                className="btn-save"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
