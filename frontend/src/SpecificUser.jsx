// src/SpecificUser.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css"; // Make sure this is imported last so it overrides global styles as needed

export default function SpecificUser() {
  const navigate = useNavigate();
  const [textValue, setTextValue] = useState("");

  const handleSave = () => {
    // TODO: Put your “save” logic here (e.g. API call)
    console.log("Saving text:", textValue);
    navigate('/'); // Go back to the previous screen (or change to any route you like)
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="specific-user-page">
      <div className="form-card">
        <h2 className="form-title">Specific User Details</h2>

        <textarea
          className="input-area"
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          placeholder="Enter your text here..."
        />

        <div className="form-actions">
          <button className="btn-cancel" onClick={handleCancel}> Cancel </button>
          <button className="btn-save" onClick={handleSave}> Save </button>
        </div>
      </div>
    </div>
  );
}
