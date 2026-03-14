import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar sticky">
      <div className="navbar-container">
        {/* Logo / Company Name */}
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-icon">📋</span>
          <span className="logo-text">SHREE PAPER PRODUCTS</span>
        </Link>

        {/* Hamburger Menu Icon */}
        <div className="hamburger-icon" onClick={toggleMenu}>
          <span className={isMenuOpen ? 'active' : ''}></span>
          <span className={isMenuOpen ? 'active' : ''}></span>
          <span className={isMenuOpen ? 'active' : ''}></span>
        </div>

        {/* Navigation Menu */}
        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          {!user && (
            <li className="navbar-item">
              <NavLink to="/" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'} onClick={closeMenu}>
                Home
              </NavLink>
            </li>
          )}
          {(!user || user.role !== 'admin') && (
            <li className="navbar-item">
              <NavLink to="/products" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'} onClick={closeMenu}>
                Products
              </NavLink>
            </li>
          )}
          {(!user || user.role !== 'admin') && (
            <li className="navbar-item">
              <NavLink to="/custom-order" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'} onClick={closeMenu}>
                Custom Order
              </NavLink>
            </li>
          )}
          <li className="navbar-item">
            <NavLink to="/about" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'} onClick={closeMenu}>
              About
            </NavLink>
          </li>
          {user && user.role === 'user' && (
            <li className="navbar-item">
              <NavLink to="/cart" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'} onClick={closeMenu}>
                Cart
              </NavLink>
            </li>
          )}

          {/* Conditional Links Based on User Authentication */}
          {user ? (
            <>
              {/* Customer Links */}
              {user.role === 'user' && (
                <>
                  <li className="navbar-item">
                    <NavLink to="/my-orders" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'} onClick={closeMenu}>
                      My Orders
                    </NavLink>
                  </li>
                  <li className="navbar-item">
                    <NavLink to="/customer-orders" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'} onClick={closeMenu}>
                      Customer Orders
                    </NavLink>
                  </li>
                </>
              )}

              {/* Admin Links */}
              {user.role === 'admin' && (
                <>
                  <li className="navbar-item">
                    <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'} onClick={closeMenu}>
                      All Orders
                    </NavLink>
                  </li>
                  <li className="navbar-item">
                    <NavLink to="/admin/custom-orders" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'} onClick={closeMenu}>
                      Custom Order
                    </NavLink>
                  </li>
                  <li className="navbar-item">
                    <NavLink to="/admin/products" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'} onClick={closeMenu}>
                      Manage Products
                    </NavLink>
                  </li>
                  <li className="navbar-item">
                    <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'} onClick={closeMenu}>
                      Dashboard
                    </NavLink>
                  </li>
                </>
              )}

              {/* User Info and Logout */}
              <li className="navbar-item navbar-user">
                <span className="user-name">{user.name}</span>
                <button
                  onClick={() => {
                    onLogout();
                    closeMenu();
                  }}
                  className="logout-btn"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="navbar-item">
                <NavLink to="/login" className={({ isActive }) => isActive ? 'navbar-link navbar-login active' : 'navbar-link navbar-login'} onClick={closeMenu}>
                  Login
                </NavLink>
              </li>
              <li className="navbar-item">
                <NavLink to="/register" className={({ isActive }) => isActive ? 'navbar-link navbar-register active' : 'navbar-link navbar-register'} onClick={closeMenu}>
                  Register
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
