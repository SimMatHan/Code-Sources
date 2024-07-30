import React, { useState, useEffect } from 'react';
import { createRequest, getRequests, getUsers } from '../services/requestService';

const RequestForm = ({ user }) => {
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('');
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const fetchedRequests = await getRequests(user);
        setRequests(fetchedRequests);
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchRequests();
    fetchUsers();
  }, [user]);

  const sendRequest = async () => {
    try {
      await createRequest({ sender: user, recipient, message });
      setMessage('');
      setRecipient('');
      const fetchedRequests = await getRequests(user);
      setRequests(fetchedRequests);
    } catch (error) {
      console.error("Failed to send request:", error);
    }
  };

  return (
    <div>
      <h2>Send a Request</h2>
      <select value={recipient} onChange={(e) => setRecipient(e.target.value)}>
        <option value="">Select a user</option>
        {users.map((user) => (
          <option key={user.name} value={user.name}>
            {user.name}
          </option>
        ))}
      </select>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Your message"
      />
      <button onClick={sendRequest}>Send Request</button>
      <h3>Received Requests</h3>
      <ul>
        {requests.map((req, index) => (
          <li key={index}>
            {req.sender} sent: {req.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RequestForm;
