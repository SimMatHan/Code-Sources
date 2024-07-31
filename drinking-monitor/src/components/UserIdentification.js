import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const db = getFirestore();

const UserIdentification = ({ onSubmit }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [deviceId, setDeviceId] = useState('');

  useEffect(() => {
    // Initialize FingerprintJS and get the device ID
    const getDeviceId = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      setDeviceId(result.visitorId);
    };
    getDeviceId();
  }, []);

  const checkUserExists = async (username, deviceId) => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username), where('deviceId', '==', deviceId));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const exists = await checkUserExists(username, deviceId);
    if (exists) {
      setError('A user with this username or device ID already exists. Please choose another one.');
    } else {
      await addDoc(collection(db, 'users'), { username, deviceId });
      onSubmit(username);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Enter your username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </label>
      <button type="submit">Submit</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default UserIdentification;