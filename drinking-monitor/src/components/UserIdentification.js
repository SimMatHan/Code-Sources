import React, { useState } from 'react';
import './UserIdentification.css';
import { createUser } from '../services/requestService';

const UserIdentification = ({ setUser }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!name) {
      setError('Please enter a name.');
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    if (storedUsers.includes(name)) {
      setError('This username is already taken. Please choose another one.');
    } else {
      try {
        await createUser({ name });
        localStorage.setItem('username', name);
        storedUsers.push(name);
        localStorage.setItem('users', JSON.stringify(storedUsers));
        setUser(name);
      } catch (error) {
        setError('Failed to create user.');
        console.error("Error creating user:", error);
      }
    }
  };

  return (
    <div className="user-identification-container">
      <h2>Enter your name</h2>
      <input
        className="input"
        type="text"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setError('');
        }}
        placeholder="Your name"
      />
      <button className="button" onClick={handleSubmit}>Submit</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default UserIdentification;
