import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import './Header.css';

const Header = ({ isAdmin = false }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSmoothScroll = (e) => {
    const href = e.currentTarget.getAttribute('href');
    if (!href || !href.startsWith('#')) return;

    e.preventDefault();
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    // Add logout logic here
    navigate('/');
  };

  return (
    <nav className="sc-navbar">
      <Container>
        <div className="sc-navbar-inner">
          <Link to="/" className="sc-brand">
            CampusCore
          </Link>

          <button
            className="sc-menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            <span />
            <span />
            <span />
          </button>

          <div className={`sc-nav-links ${menuOpen ? 'open' : ''}`}>
            <a href="/" className="smoothScroll" onClick={handleSmoothScroll}>Home</a>
            <a href="#about" className="smoothScroll" onClick={handleSmoothScroll}>About</a>
            <a href="#feature" className="smoothScroll" onClick={handleSmoothScroll}>Features</a>
            <Link to="/resources" onClick={() => setMenuOpen(false)}>Resources</Link>
            <Link to="/bookings" onClick={() => setMenuOpen(false)}>Bookings</Link>
            <a href="#testimonial" className="smoothScroll" onClick={handleSmoothScroll}>Reviews</a>
            <a href="#contact" className="smoothScroll" onClick={handleSmoothScroll}>Contact</a>
            
            {isAdmin ? (
              <>
                <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <Link to="/admin/resources" onClick={() => setMenuOpen(false)}>Manage</Link>
                <a href="#/" onClick={(e) => { e.preventDefault(); handleLogout(); setMenuOpen(false); }}>Logout</a>
              </>
            ) : (
              <Link to="/admin/login" onClick={() => setMenuOpen(false)} className="sc-nav-phone">Admin Login</Link>
            )}
          </div>
        </div>
      </Container>
    </nav>
  );
};

export default Header;
