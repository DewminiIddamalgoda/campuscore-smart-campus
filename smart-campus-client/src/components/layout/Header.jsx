import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { FaUserCircle } from 'react-icons/fa';
import './Header.css';

const Header = ({ isAdmin = false }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, isAuthenticated, hasRole, user } = useAuth();

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

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getDisplayName = () => {
    if (!user?.fullName) {
      return 'Account';
    }

    const parts = user.fullName.trim().split(/\s+/);
    return parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1]}` : parts[0];
  };

  const showAdminLinks = isAdmin || hasRole(['ADMIN', 'TECHNICIAN']);

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
            
            {isAuthenticated ? (
              <>
                {showAdminLinks && <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>}
                {showAdminLinks && <Link to="/admin/resources" onClick={() => setMenuOpen(false)}>Manage</Link>}
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="sc-user-name" title={user?.fullName || 'Profile'}>
                  <FaUserCircle style={{ marginRight: 8 }} />
                  {getDisplayName()}
                </Link>
                <a href="#/" onClick={(e) => { e.preventDefault(); handleLogout(); setMenuOpen(false); }}>Logout</a>
              </>
            ) : (
              <Link to="/#login" onClick={() => setMenuOpen(false)} className="sc-nav-phone">Log In</Link>
            )}
          </div>
        </div>
      </Container>
    </nav>
  );
};

export default Header;
