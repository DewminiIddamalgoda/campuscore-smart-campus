import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

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
            <a href="#testimonial" className="smoothScroll" onClick={handleSmoothScroll}>Reviews</a>
            <a href="#contact" className="smoothScroll" onClick={handleSmoothScroll}>Contact</a>
            <a href="#login" className="sc-nav-phone">Login</a>
          </div>
        </div>
      </Container>
    </nav>
  );
};

export default Navbar;
