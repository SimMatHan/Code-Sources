import React, { useState } from 'react';
import './UserIdentification.css';

const UserIdentification = ({ setUser }) => {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    localStorage.setItem('username', name);
    setUser(name);
  };

  return (
    <div className="user-identification-container">
      <h2>Enter your name</h2>
      <input
        className="input"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
      />
      <button className="button" onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default UserIdentification;
