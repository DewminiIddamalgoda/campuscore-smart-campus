import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer id="footer" className="site-footer">
      <div className="footer-glow footer-glow-1"></div>
      <div className="footer-glow footer-glow-2"></div>

      <Container>
        <div className="footer-top-card">
          <Row className="align-items-center g-4">
            <Col lg={8} md={12}>
              <div className="footer-cta">
                <span className="footer-badge">CampusCore Platform</span>
                <h2>Manage campus resources with clarity, speed, and control</h2>
                <p>
                  A smarter way to organize facilities, assets, bookings, and campus
                  operations in one modern platform.
                </p>
              </div>
            </Col>

            <Col lg={4} md={12}>
              <div className="footer-cta-actions">
                <Link to="/resources" className="footer-cta-btn primary">
                  Explore Resources
                </Link>
                <a href="#contact" className="footer-cta-btn secondary smoothScroll">
                  Request Demo
                </a>
              </div>
            </Col>
          </Row>
        </div>

        <Row className="g-4 footer-main-row">
          <Col lg={4} md={6} sm={12}>
            <div className="footer-block footer-brand-block">
              <div className="footer-logo-wrap">
                <div className="footer-logo-icon">
                  <i className="fa fa-university" />
                </div>
                <div>
                  <h3>CampusCore</h3>
                  <span className="footer-subtitle">Smart resource management platform</span>
                </div>
              </div>

              <p className="footer-description">
                Built for efficient campus operations with better visibility for
                facilities, assets, bookings, and support workflows.
              </p>

              <div className="footer-socials">
                <a href="/" aria-label="Facebook"><i className="fa fa-facebook-square" /></a>
                <a href="/" aria-label="Twitter"><i className="fa fa-twitter" /></a>
                <a href="/" aria-label="GitHub"><i className="fa fa-github" /></a>
                <a href="/" aria-label="LinkedIn"><i className="fa fa-linkedin" /></a>
              </div>
            </div>
          </Col>

          <Col lg={2} md={6} sm={6}>
            <div className="footer-block">
              <h4>Platform</h4>
              <div className="footer-links">
                <a href="#about" className="smoothScroll">About</a>
                <a href="#feature" className="smoothScroll">Features</a>
                <Link to="/resources">Resources</Link>
                <a href="#testimonial" className="smoothScroll">Reviews</a>
              </div>
            </div>
          </Col>

          <Col lg={2} md={6} sm={6}>
            <div className="footer-block">
              <h4>Modules</h4>
              <div className="footer-links">
                <Link to="/resources">Catalogue</Link>
                <a href="#courses" className="smoothScroll">Bookings</a>
                <a href="#courses" className="smoothScroll">Incidents</a>
                <a href="#contact" className="smoothScroll">Support</a>
              </div>
            </div>
          </Col>

          <Col lg={4} md={6} sm={12}>
            <div className="footer-block footer-newsletter advanced-newsletter">
              <h4>Stay Updated</h4>
              <p className="newsletter-text">
                Get updates about new platform improvements, system enhancements, and
                smart campus features.
              </p>

              <form className="footer-newsletter-form">
                <div className="newsletter-input-wrap">
                  <i className="fa fa-envelope-o newsletter-icon" />
                  <input
                    type="email"
                    className="modern-input footer-input"
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <Button className="modern-btn w-100 footer-subscribe-btn" variant="primary">
                  Subscribe Now
                </Button>
              </form>

              <div className="footer-contact-mini">
                <div className="mini-contact-item">
                  <i className="fa fa-phone" />
                  <span>+94 11 754 4801</span>
                </div>
                <div className="mini-contact-item">
                  <i className="fa fa-envelope" />
                  <a href="mailto:campuscore@group.com">campuscore@group.com</a>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <p>© 2026 CampusCore. All rights reserved.</p>
          </div>

          <div className="footer-bottom-right">
            <span>Designed for IT3030 PAF Assignment</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
