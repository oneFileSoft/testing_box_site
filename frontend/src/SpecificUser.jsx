import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

export default function SpecificUser() {
  const navigate = useNavigate();
  const [textValue, setTextValue] = useState("");

  const handleSave = () => {
    // TODO: add your “save” logic here
    console.log("Saving text:", textValue);
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <h2 className="form-heading">Arbatrade info</h2>

        <textarea
          className="form-textarea"
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          placeholder="Enter your text here..."
        />

        <div className="button-row">
          <button className="btn btn-cancel" onClick={handleCancel}>Cancel</button>
          <button className="btn btn-save" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
