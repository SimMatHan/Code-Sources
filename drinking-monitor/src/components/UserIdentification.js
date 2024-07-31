import React, { useState } from 'react';
import './UserIdentification.css'; // Adjust the path if necessary

const UserIdentification = ({ onSubmit }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onSubmit(username);
    } else {
      alert('Please enter a username.');
    }
  };

  return (
    <div className="user-identification-container">
      <div className="app-introduction">
        <h1>Welcome to Sladesh!</h1>
        <p>
          Sladesh is an app where you can monitor drinks and give your friends a sladesh. 
          Please create your account to get started. <br/>
          <br/>
          Remember, you only need to create an account once!
        </p>
      </div>
      <form onSubmit={handleSubmit} className="user-identification-form">
        <label className="user-identification-label">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input"
            placeholder="Enter your username"
          />
        </label>
        <button type="submit" className="button">Submit</button>
      </form>
    </div>
  );
};

export default UserIdentification;
