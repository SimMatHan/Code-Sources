import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { onAuthStateChanged, signInAnonymously, updateProfile } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import GlobalStyle from './globalStyles';
import Header from './components/Header';
import Home from './components/Home';
import RequestForm from './components/RequestForm';
import UserIdentification from './components/UserIdentification';
import { auth } from './firebaseConfig';

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

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({ uid: user.uid, displayName: user.displayName });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleReset = () => {
    localStorage.removeItem('drinkData');
    setDrinks({});
  };

  const handleUserSubmit = async (username) => {
    try {
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;

      await updateProfile(user, { displayName: username });

      // Call the signInUser function with username and UID
      const functions = getFunctions();
      const signInUser = httpsCallable(functions, 'signInUser');
      const result = await signInUser({ username, uid: user.uid });

      if (result.data.message === 'User created successfully.' || result.data.username) {
        localStorage.setItem('username', username);
        setUser({ uid: user.uid, displayName: username });
      } else {
        throw new Error('Failed to create or sign in user');
      }
    } catch (error) {
      alert('Failed to create user. Please try again.');
      console.error('Error:', error);
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
