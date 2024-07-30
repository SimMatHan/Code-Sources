import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ onReset }) => {
  return (
    <header className="header-container">
      <h1>Drinking Monitor</h1>
      <button className="reset-button" onClick={onReset}>Reset</button>
      <Link to="/">Home</Link>
      <Link to="/requests">Requests</Link>
    </header>
  );
};

export default Header;
