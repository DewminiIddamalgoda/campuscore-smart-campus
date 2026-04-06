import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Row, Col } from 'react-bootstrap';
import './HomePage.css';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const slides = [
    {
      title: 'Smart Campus Resource Management Made Simple',
      subtitle:
        'Manage lecture halls, labs, meeting rooms, and equipment through one smart and centralized platform.',
      buttonText: 'Discover More',
      buttonTarget: '#feature',
      className: 'hero-slide hero-slide-1',
    },
    {
      title: 'Find the Right Campus Resource Instantly',
      subtitle:
        'Search, filter, and manage available resources based on type, capacity, location, and availability windows.',
      buttonText: 'View Resources',
      buttonTarget: '/resources',
      className: 'hero-slide hero-slide-2',
    },
    {
      title: 'Built for Smart Campus Operations',
      subtitle:
        'A modern web solution using Spring Boot and React to support facilities, bookings, maintenance, and notifications.',
      buttonText: 'Contact Us',
      buttonTarget: '#contact',
      className: 'hero-slide hero-slide-3',
    },
  ];

  const features = [
    {
      number: '01',
      title: 'Resource Catalogue',
      description:
        'Maintain a complete catalogue of campus resources including lecture halls, labs, meeting rooms, and equipment.',
      icon: 'fa-building',
    },
    {
      number: '02',
      title: 'Smart Filtering',
      description:
        'Search resources by type, capacity, status, and location to quickly find the best match for your needs.',
      icon: 'fa-search',
    },
    {
      number: '03',
      title: 'Availability Insights',
      description:
        'View resource availability windows and status such as ACTIVE or OUT_OF_SERVICE with clear visual indicators.',
      icon: 'fa-clock-o',
    },
  ];

  const resourceCards = [
    {
      image: '/images/resource1.jpg',
      title: 'Lecture Halls',
      subtitle: 'Large capacity academic spaces',
      icons: ['fa-building', 'fa-users', 'fa-map-marker'],
    },
    {
      image: '/images/resource2.jpg',
      title: 'Laboratories',
      subtitle: 'Practical learning environments',
      icons: ['fa-flask', 'fa-desktop', 'fa-clock-o'],
    },
    {
      image: '/images/resource3.jpg',
      title: 'Meeting Rooms',
      subtitle: 'Collaborative discussion spaces',
      icons: ['fa-handshake-o', 'fa-users', 'fa-calendar'],
    },
    {
      image: '/images/resource4.jpg',
      title: 'Equipment',
      subtitle: 'Projectors, cameras, and more',
      icons: ['fa-video-camera', 'fa-laptop', 'fa-cogs'],
    },
  ];

  const modules = [
    {
      image: '/images/module1.jpg',
      icon: 'fa-database',
      title: 'Facilities & Assets Catalogue',
      subtitle: 'Component 1',
      tag: 'Core Module',
      description:
        'Manage resources with metadata such as type, capacity, location, status, and availability.',
      author: 'Your Component',
      badgeClass: 'badge-active',
    },
    {
      image: '/images/module2.jpg',
      icon: 'fa-calendar',
      title: 'Booking Management',
      subtitle: 'Workflow Module',
      tag: 'Team Module',
      description:
        'Handle booking requests, approvals, rejections, cancellations, and scheduling conflict prevention.',
      author: 'Team Module',
      badgeClass: 'badge-team',
    },
    {
      image: '/images/module3.jpg',
      icon: 'fa-wrench',
      title: 'Incident & Notifications',
      subtitle: 'Support Module',
      tag: 'Team Module',
      description:
        'Track maintenance tickets, comments, technician updates, and user notifications in one place.',
      author: 'Team Module',
      badgeClass: 'badge-support',
    },
  ];

  const testimonials = [
    {
      image: '/images/tst-image1.jpg',
      name: 'Admin User',
      role: 'Campus Administrator',
      comment:
        'The system makes it much easier to organize university resources and monitor their availability in one place.',
      rating: 5,
    },
    {
      image: '/images/tst-image2.jpg',
      name: 'Student',
      role: 'System User',
      comment:
        'The filtering feature helps us quickly find the right room or lab without checking multiple sources.',
      rating: 4,
    },
    {
      image: '/images/tst-image3.jpg',
      name: 'Technician',
      role: 'Staff Member',
      comment:
        'Having resource information and maintenance-related details connected in one platform improves efficiency a lot.',
      rating: 4,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
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

    const smoothScrollLinks = document.querySelectorAll('.smoothScroll');
    smoothScrollLinks.forEach((link) => {
      link.addEventListener('click', handleSmoothScroll);
    });

    return () => {
      smoothScrollLinks.forEach((link) => {
        link.removeEventListener('click', handleSmoothScroll);
      });
    };
  }, []);

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <i key={i} className={`fa ${i < rating ? 'fa-star' : 'fa-star-o'}`} />
    ));

  return (
    <div className="home-page">
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
              <a href="#home" className="smoothScroll">Home</a>
              <a href="#about" className="smoothScroll">About</a>
              <a href="#feature" className="smoothScroll">Features</a>
              <Link to="/resources" onClick={() => setMenuOpen(false)}>Resources</Link>
              <a href="#testimonial" className="smoothScroll">Reviews</a>
              <a href="#contact" className="smoothScroll">Contact</a>
              <a href="tel:+94117544801" className="sc-nav-phone">
                <i className="fa fa-phone" /> +94 11 754 4801
              </a>
            </div>
          </div>
        </Container>
      </nav>

      <section id="home" className="hero-section">
        <div key={currentSlide} className={slides[currentSlide].className}>
          <div className="hero-overlay" />
          <Container className="hero-content">
            <Row className="align-items-center">
              <Col lg={7} md={8} sm={12}>
                <span className="hero-badge">CampusCore</span>
                <h1>{slides[currentSlide].title}</h1>
                <p>{slides[currentSlide].subtitle}</p>
                <div className="hero-actions">
                  {slides[currentSlide].buttonTarget.startsWith('#') ? (
                    <a
                      href={slides[currentSlide].buttonTarget}
                      className="primary-btn smoothScroll"
                    >
                      {slides[currentSlide].buttonText}
                    </a>
                  ) : (
                    <Link to={slides[currentSlide].buttonTarget} className="primary-btn">
                      {slides[currentSlide].buttonText}
                    </Link>
                  )}
                  <Link to="/resources" className="secondary-btn">
                    Browse Resources
                  </Link>
                </div>
              </Col>
            </Row>
          </Container>

          <button className="hero-arrow hero-arrow-left" onClick={goToPrevSlide}>
            <i className="fa fa-angle-left" />
          </button>
          <button className="hero-arrow hero-arrow-right" onClick={goToNextSlide}>
            <i className="fa fa-angle-right" />
          </button>

          <div className="hero-dots">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`hero-dot ${currentSlide === index ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="feature" className="section-block">
        <Container>
          <div className="section-header text-center">
            <span className="section-label">Core Strengths</span>
            <h2>Designed for Efficient Campus Resource Management</h2>
            <p>
              A clean and scalable platform for managing facilities, assets, and campus
              operations with better visibility and control.
            </p>
          </div>

          <Row>
            {features.map((feature, index) => (
              <Col key={index} lg={4} md={6} sm={12} className="mb-4">
                <div className="modern-card feature-card">
                  <div className="feature-top">
                    <span className="feature-number">{feature.number}</span>
                    <div className="feature-icon">
                      <i className={`fa ${feature.icon}`} />
                    </div>
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section id="about" className="section-block section-light">
        <Container>
          <Row className="align-items-center g-4">
            <Col lg={7} md={12}>
              <div className="about-content">
                <span className="section-label">About the Platform</span>
                <h2>Built to support modern campus operations</h2>
                <p className="about-lead">
                  The CampusCore helps universities manage facilities,
                  assets, and operational workflows through one centralized system.
                </p>

                <div className="about-items">
                  <div className="about-item">
                    <div className="about-icon"><i className="fa fa-building" /></div>
                    <div>
                      <h4>Facility Management</h4>
                      <p>
                        Manage lecture halls, labs, and meeting rooms with structured
                        metadata and real-time visibility.
                      </p>
                    </div>
                  </div>

                  <div className="about-item">
                    <div className="about-icon"><i className="fa fa-desktop" /></div>
                    <div>
                      <h4>Asset Tracking</h4>
                      <p>
                        Organize bookable assets such as projectors, cameras, and
                        equipment in one connected platform.
                      </p>
                    </div>
                  </div>

                  <div className="about-item">
                    <div className="about-icon"><i className="fa fa-line-chart" /></div>
                    <div>
                      <h4>Better Decision Making</h4>
                      <p>
                        Improve space utilization and reduce operational confusion with
                        cleaner data and better resource planning.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={5} md={12}>
              <div className="modern-card login-card">
                <h3>Login to Dashboard</h3>
                <p>Access your campus system account securely.</p>

                <form>
                  <input type="text" className="modern-input" placeholder="Full name" required />
                  <input type="email" className="modern-input" placeholder="University email" required />
                  <input type="password" className="modern-input" placeholder="Password" required />
                  <Button className="w-100 modern-btn" variant="primary">
                    Sign In
                  </Button>
                </form>

                <div className="login-note">
                  OAuth login can be connected here later.
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section id="resources" className="section-block">
        <Container>
          <div className="section-header text-center">
            <span className="section-label">Campus Resources</span>
            <h2>Explore the main types of university resources</h2>
          </div>

          <Row>
            {resourceCards.map((item, index) => (
              <Col key={index} lg={3} md={6} sm={12} className="mb-4">
                <div className="modern-card resource-card">
                  <div className="resource-image-wrap">
                    <img src={item.image} alt={item.title} className="resource-image" />
                  </div>
                  <div className="resource-content">
                    <h3>{item.title}</h3>
                    <p>{item.subtitle}</p>
                    <div className="resource-icons">
                      {item.icons.map((icon, i) => (
                        <span key={i}><i className={`fa ${icon}`} /></span>
                      ))}
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>

          <div className="text-center mt-3">
            <Link to="/resources" className="primary-btn">
              View All Resources
            </Link>
          </div>
        </Container>
      </section>

      <section id="courses" className="section-block section-light">
        <Container>
          <div className="section-header text-center">
            <span className="section-label">System Modules</span>
            <h2>Main functional areas of the platform</h2>
          </div>

          <Row>
            {modules.map((module, index) => (
              <Col key={index} lg={4} md={6} sm={12} className="mb-4">
                <div className="modern-card module-card">
                  <div className="module-image-wrap">
                    <img src={module.image} alt={module.title} className="module-image" />
                    <div className="module-tag">
                      <i className={`fa ${module.icon}`} /> {module.subtitle}
                    </div>
                  </div>

                  <div className="module-content">
                    <h3>{module.title}</h3>
                    <p>{module.description}</p>

                    <div className="module-footer">
                      <span className="module-author">{module.author}</span>
                      <span className={`module-badge ${module.badgeClass}`}>{module.tag}</span>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section id="testimonial" className="section-block">
        <Container>
          <div className="section-header text-center">
            <span className="section-label">User Feedback</span>
            <h2>What users think about the system</h2>
          </div>

          <Row>
            {testimonials.map((testimonial, index) => (
              <Col key={index} lg={4} md={6} sm={12} className="mb-4">
                <div className="modern-card testimonial-card">
                  <div className="testimonial-top">
                    <img src={testimonial.image} alt={testimonial.name} className="testimonial-avatar" />
                    <div>
                      <h4>{testimonial.name}</h4>
                      <span>{testimonial.role}</span>
                    </div>
                  </div>
                  <p className="testimonial-text">“{testimonial.comment}”</p>
                  <div className="tst-rating">{renderStars(testimonial.rating)}</div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section id="contact" className="section-block section-light">
        <Container>
          <Row className="align-items-center g-4">
            <Col lg={6} md={12}>
              <div className="contact-box modern-card">
                <span className="section-label">Contact Us</span>
                <h2>For project demo or more details</h2>
                <form>
                  <input type="text" className="modern-input" placeholder="Enter full name" required />
                  <input type="email" className="modern-input" placeholder="Enter email address" required />
                  <textarea className="modern-input modern-textarea" rows={6} placeholder="Enter your message" required />
                  <Button className="modern-btn" variant="primary">
                    Send Message
                  </Button>
                </form>
              </div>
            </Col>

            <Col lg={6} md={12}>
              <div className="contact-image-card modern-card">
                <img src="/images/contact-image.jpg" alt="Smart Campus Contact" className="contact-image" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

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
    </div>
  );
};

export default HomePage;