import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          Weather Helper
        </Link>
        <nav className="nav">
          {!isHomePage && (
            <NavLink to="/" end>
              Home
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
