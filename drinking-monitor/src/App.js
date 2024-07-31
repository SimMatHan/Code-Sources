import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GlobalStyle from './globalStyles';
import Header from './components/Header';
import Home from './components/Home';
import RequestForm from './components/RequestForm';
import UserIdentification from './components/UserIdentification';

const App = () => {
  const [user, setUser] = useState(null);
  const [drinks, setDrinks] = useState({});

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('drinkData'));
    if (storedData) {
      const now = new Date().getTime();
      const EXPIRATION_TIME_MS = 30 * 1000; // 30 seconds for testing

      if (now - storedData.timestamp < EXPIRATION_TIME_MS) {
        setDrinks(storedData.drinks);
      } else {
        localStorage.removeItem('drinkData');
      }
    }

    const storedUser = localStorage.getItem('username');
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleReset = () => {
    localStorage.removeItem('drinkData');
    localStorage.removeItem('username');
    setDrinks({});
    setUser(null);
  };

  const handleUserSubmit = (username) => {
    const existingUser = localStorage.getItem('username');
    if (existingUser) {
      alert('Username already taken. Please choose another one.');
    } else {
      localStorage.setItem('username', username);
      setUser(username);
    }
  };

  if (!user) {
    return <UserIdentification onSubmit={handleUserSubmit} />;
  }

  return (
    <>
      <GlobalStyle />
      <Router>
        <Header onReset={handleReset} />
        <Routes>
          <Route path="/" element={<Home user={user} drinks={drinks} setDrinks={setDrinks} />} />
          <Route path="/requests" element={<RequestForm user={user} />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;