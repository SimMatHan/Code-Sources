import React from 'react';
import './Header.css';

const Header = ({ onReset }) => {
  return (
    <header className="header-container">
      <h1>Drinking Monitor</h1>
      <button className="reset-button" onClick={onReset}>Reset</button>
    </header>
  );
};

export default Header;
