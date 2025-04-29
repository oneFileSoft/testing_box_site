import React, { useState, useEffect } from 'react';
import "./App.css";

export default function SessionStorage() {
  const [generatedUsername, setGeneratedUsername] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [inputUsername, setInputUsername] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [error, setError] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const randomUser = `user${Math.floor(1000 + Math.random() * 9000)}`;
    const randomPass = `pass${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedUsername(randomUser);
    setGeneratedPassword(randomPass);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputUsername === generatedUsername && inputPassword === generatedPassword) {
      setLoggedIn(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
//         <div className="user-container">
      <h2>
        Please login using the following credentials:<br />
        Username: <strong>{generatedUsername}</strong>, Password: <strong>{generatedPassword}</strong>
      </h2>

      {!loggedIn && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '1rem' }}>
          <input
            type="text"
            placeholder="Username"
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
          />
          <button type="submit">Submit</button>
        </form>
      )}

      {error && <div style={{ color: 'red', fontSize: '1.5rem', marginTop: '1rem' }}>Error login</div>}

      {loggedIn && (
        <div style={{ color: 'green', fontSize: '1.5rem', marginTop: '1rem' }}>
          User <strong>{generatedUsername}</strong> has been logged in!
        </div>
      )}
    </div>
  );
}
