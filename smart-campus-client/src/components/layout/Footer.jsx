import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaGithub, FaEnvelope, FaPhone } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container>
        <Row>
          <Col md={4}>
            <h5 className="mb-3">Smart Campus</h5>
            <p className="text-muted">
              Modern campus resource management system for efficient facility booking and maintenance tracking.
            </p>
          </Col>
          
          <Col md={4}>
            <h5 className="mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="/" className="text-muted text-decoration-none">Home</a>
              </li>
              <li className="mb-2">
                <a href="/resources" className="text-muted text-decoration-none">Resources</a>
              </li>
              <li className="mb-2">
                <a href="/about" className="text-muted text-decoration-none">About</a>
              </li>
              <li className="mb-2">
                <a href="/contact" className="text-muted text-decoration-none">Contact</a>
              </li>
            </ul>
          </Col>
          
          <Col md={4}>
            <h5 className="mb-3">Contact Info</h5>
            <div className="text-muted">
              <p className="mb-2">
                <FaEnvelope className="me-2" />
                info@smartcampus.edu
              </p>
              <p className="mb-2">
                <FaPhone className="me-2" />
                +1 (555) 123-4567
              </p>
              <p className="mb-2">
                <FaGithub className="me-2" />
                Smart Campus GitHub
              </p>
            </div>
          </Col>
        </Row>
        
        <hr className="my-4 border-secondary" />
        
        <Row>
          <Col className="text-center">
            <p className="text-muted mb-0">
              © 2026 Smart Campus. All rights reserved. | IT3030 PAF Assignment
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
