import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Header from './components/Header';
import GlobalStyle from './globalStyles';
import UserIdentification from './components/UserIdentification';
import RequestForm from './components/RequestForm';

const App = () => {
  const [user, setUser] = useState(null);
  const [drinks, setDrinks] = useState({});

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    if (storedUser) {
      setUser(storedUser);
    }

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
  }, []);

  const handleReset = () => {
    localStorage.removeItem('drinkData');
    setDrinks({});
  };

  if (!user) {
    return <UserIdentification setUser={setUser} />;
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
