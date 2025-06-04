// src/SpecificUser.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css'; // or your global CSS

export default function SpecificUser() {
  const navigate = useNavigate();
  const [textValue, setTextValue] = useState('');

  const handleSave = () => {
    // TODO: Add whatever “save” logic you need (e.g. send `textValue` to backend)
    console.log('Saving text:', textValue);
    navigate(-1); // go back to previous page (or replace with any route)
  };

  const handleCancel = () => {
    navigate(-1); // simply navigate back
  };

  return (
    <div className="specific-user-container" style={containerStyle}>
      <h2 style={headingStyle}>Specific User Details</h2>

      <textarea
        value={textValue}
        onChange={(e) => setTextValue(e.target.value)}
        placeholder="Enter your text here..."
        style={textareaStyle}
      />

      <div style={buttonRowStyle}>
        <button onClick={handleCancel} style={cancelButtonStyle}>
          Cancel
        </button>
        <button onClick={handleSave} style={saveButtonStyle}>
          Save
        </button>
      </div>
    </div>
  );
}

// ─── Inline styles (feel free to move these into App.css) ────────────────────

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '600px',
  margin: '0 auto',
  padding: '16px',
};

const headingStyle = {
  marginBottom: '12px',
  textAlign: 'center',
};

const textareaStyle = {
  width: '100%',
  height: '300px',
  padding: '8px',
  fontSize: '16px',
  resize: 'vertical',
  marginBottom: '16px',
  boxSizing: 'border-box',
};

const buttonRowStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '8px',
};

const cancelButtonStyle = {
  backgroundColor: '#ccc',
  color: '#000',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '4px',
  cursor: 'pointer',
};

const saveButtonStyle = {
  backgroundColor: '#2563EB', // blue-500
  color: '#FFF',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '4px',
  cursor: 'pointer',
};
