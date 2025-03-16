import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Nav() {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };
  
  return (
    <nav className="main-nav">
      <div className="logo">
        <Link to="/">SoundCraft Pro</Link>
      </div>
      
      <ul className="nav-links">
        <li className={isActive('/')}>
          <Link to="/">Home</Link>
        </li>
        <li className={isActive('/editor')}>
          <Link to="/editor">Editor</Link>
        </li>
        <li className={isActive('/tools') || location.pathname.startsWith('/tools')}>
          <Link to="/tools">Tools</Link>
        </li>
      </ul>
      
      <div className="auth-buttons">
        <button className="btn btn-outline">Login</button>
      </div>
    </nav>
  );
}

export default Nav;