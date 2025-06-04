// src/SpecificUser.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SpecificUser.css"; // Your form styles

export default function SpecificUser() {
  const navigate = useNavigate();

  // ─── State Hooks ────────────────────────────────────────────────────────────
  const [textValue, setTextValue] = useState("");
  const [fileVersion, setFileVersion] = useState(0);  // mtimeMs from server
  const [loading, setLoading] = useState(true);       // true while GET is in progress
  const [saving, setSaving] = useState(false);        // true while POST is in progress
  const [error, setError] = useState(null);           // any error message to show

  // ─── 1) On mount, GET /api/company-text to load current text & version ───────
  useEffect(() => {
    let isMounted = true;

    async function fetchCompanyText() {
      try {
        const res = await axios.get("/api/company-text");
        if (res.data.success) {
          if (isMounted) {
            setTextValue(res.data.text);
            setFileVersion(res.data.version);
          }
        } else {
          if (isMounted) setError("Failed to load data from server.");
        }
      } catch (err) {
        console.error("GET /api/company-text error:", err);
        if (isMounted) setError("Error loading data.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchCompanyText();

    return () => {
      isMounted = false;
    };
  }, []);

  // ─── 2) Handle “Save” click: POST /api/company-text with version check ────────
  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const payload = {
        text: textValue,
        clientVersion: fileVersion,
      };

      const res = await axios.post("/api/company-text", payload);

      // If we get here, server responded { success: true, version: NEW_VERSION }
      if (res.data.success) {
        // Optionally update version (though we navigate away immediately)
        setFileVersion(res.data.version);
        sessionStorage.clear();
        navigate("/");
      } else {
        // In practice, a “success: false” is unlikely without a 409 status,
        // but handle it just in case.
        setError("Save failed. Please try again.");
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        // Conflict: server sends { text: latestText, version: latestVersion }
        const { text: latestText, version: latestVersion } = err.response.data;

        setError(
          "Conflict: The file changed on the server. Reloading latest version..."
        );
        setTextValue(latestText);
        setFileVersion(latestVersion);
      } else {
        console.error("POST /api/company-text error:", err);
        setError("Error saving data.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    sessionStorage.clear();
    navigate("/");
  };

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

            {error && <p className="error-msg">{error}</p>}

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

