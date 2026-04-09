import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { FaHome, FaList, FaChartBar, FaCog, FaSignOutAlt } from 'react-icons/fa';

const Header = ({ isAdmin = false }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add logout logic here
    navigate('/');
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          <FaHome className="me-2" />
          Smart Campus
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              <FaHome className="me-1" />
              Home
            </Nav.Link>
            
            {isAdmin ? (
              <>
                <Nav.Link as={Link} to="/admin/dashboard">
                  <FaChartBar className="me-1" />
                  Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/resources">
                  <FaCog className="me-1" />
                  Manage Resources
                </Nav.Link>
              </>
            ) : (
              <Nav.Link as={Link} to="/resources">
                <FaList className="me-1" />
                Resources
              </Nav.Link>
            )}
          </Nav>
          
          <Nav>
            {isAdmin ? (
              <Button variant="outline-light" onClick={handleLogout}>
                <FaSignOutAlt className="me-1" />
                Logout
              </Button>
            ) : (
              <Nav.Link as={Link} to="/admin/login" className="text-white">
                Admin Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
