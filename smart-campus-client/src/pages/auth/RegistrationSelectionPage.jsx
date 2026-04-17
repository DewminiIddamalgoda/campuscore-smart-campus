import React from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './AuthPages.css';

const RegistrationSelectionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('email');
  const fullName = searchParams.get('fullName');
  const firstName = searchParams.get('firstName');
  const lastName = searchParams.get('lastName');
  const message = searchParams.get('message');

  const buildRegistrationPath = (role) => {
    const params = new URLSearchParams();

    if (email) params.set('email', email);
    if (fullName) params.set('fullName', fullName);
    if (firstName) params.set('firstName', firstName);
    if (lastName) params.set('lastName', lastName);

    const query = params.toString();
    return query ? `/register/${role}?${query}` : `/register/${role}`;
  };

  return (
    <div className="auth-page">
      <Container className="auth-shell">
        <div className="auth-hero modern-card">
          <span className="auth-badge">Create account</span>
          <h1>Choose your registration type</h1>
          <p>
            Register as a student, admin, or technician to access the campus platform with the right role.
          </p>
          {message && <div className="login-inline-alert mt-3">{message}</div>}
        </div>

        <Row className="g-4 auth-grid">
          <Col md={4}>
            <button type="button" className="auth-choice-card modern-card" onClick={() => navigate(buildRegistrationPath('student'))}>
              <span className="choice-icon">S</span>
              <h3>Student</h3>
              <p>Access booking, resources, and student-specific campus workflows.</p>
            </button>
          </Col>

          <Col md={4}>
            <button type="button" className="auth-choice-card modern-card" onClick={() => navigate(buildRegistrationPath('admin'))}>
              <span className="choice-icon">A</span>
              <h3>Admin</h3>
              <p>Manage campus resources, approvals, dashboards, and operational tasks.</p>
            </button>
          </Col>

          <Col md={4}>
            <button type="button" className="auth-choice-card modern-card" onClick={() => navigate(buildRegistrationPath('technician'))}>
              <span className="choice-icon">T</span>
              <h3>Technician</h3>
              <p>Use the same privileges as admin for support and maintenance workflows.</p>
            </button>
          </Col>
        </Row>

        <div className="auth-footer-actions">
          <Button variant="outline-light" className="auth-back-btn" onClick={() => navigate('/#login')}>
            Back to login
          </Button>
          <Link to="/#login" className="auth-link">
            Already have an account? Click here to login
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default RegistrationSelectionPage;
