import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">Weather Helper</Link>
        <nav className="nav">
          <NavLink to="/" end>Home</NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;