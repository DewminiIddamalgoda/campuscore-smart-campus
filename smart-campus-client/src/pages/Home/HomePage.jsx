import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { FaUserCircle } from 'react-icons/fa';
import './HomePage.css';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [loginState, setLoginState] = useState({
    loading: false,
    error: '',
  });
  const [googleOAuthEnabled, setGoogleOAuthEnabled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { login, applySession, isAuthenticated, logout, hasRole, user } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

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
      buttonText: 'Admin Dashboard',
      buttonTarget: '/admin/dashboard',
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
      author: 'Module',
      badgeClass: 'badge-active',
    },
    {
      image: '/images/module2.jpg',
      icon: 'fa-calendar',
      title: 'Booking Management',
      subtitle: 'Workflow Module',
      tag: 'Module',
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
      tag: 'Module',
      description:
        'Track maintenance tickets, comments, technician updates, and user notifications in one place.',
      author: 'Team Module',
      badgeClass: 'badge-support',
    },
    {
      image: '/images/module4.png',
      icon: 'fa-bar-chart',
      title: 'Reports & Analytics',
      subtitle: 'Insight Module',
      tag: 'Advanced Module',
      description:
        'Generate reports on bookings, resource usage, space utilization, and maintenance trends for better planning.',
      author: 'Analytics Module',
      badgeClass: 'badge-analytics',
    },
    {
      image: '/images/module5.jpg',
      icon: 'fa-user-circle',
      title: 'User & Role Management',
      subtitle: 'Security Module',
      tag: 'Admin Module',
      description:
        'Control user accounts, permissions, and role-based access for administrators, staff, technicians, and students.',
      author: 'Admin Module',
      badgeClass: 'badge-admin',
    },
    {
      image: '/images/module6.jpg',
      icon: 'fa-bell',
      title: 'Announcements & Alerts',
      subtitle: 'Communication Module',
      tag: 'Support Module',
      description:
        'Send booking reminders, system alerts, maintenance announcements, and important platform updates to users.',
      author: 'Communication Module',
      badgeClass: 'badge-communication',
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

  const faqs = [
    {
      question: 'What is CampusCore used for?',
      answer:
        'CampusCore is used to manage campus resources such as lecture halls, laboratories, meeting rooms, and equipment through one centralized system.',
    },
    {
      question: 'Who can use this platform?',
      answer:
        'Administrators, academic staff, technicians, and students can use the system based on their assigned roles and permissions.',
    },
    {
      question: 'Can users check resource availability before booking?',
      answer:
        'Yes. The platform allows users to view availability, status, and booking windows before submitting a request.',
    },
    {
      question: 'Does the system handle maintenance issues?',
      answer:
        'Yes. Maintenance incidents, technician comments, progress updates, and notifications can all be managed within the system.',
    },
    {
      question: 'Can the platform prevent booking conflicts?',
      answer:
        'Yes. The booking workflow is designed to reduce overlapping requests and support approval-based scheduling decisions.',
    },
    {
      question: 'What technologies are used in this project?',
      answer:
        'This platform is designed as a modern web application using React for the frontend and Spring Boot for backend services.',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    const shouldScrollToLogin = location.state?.scrollToLogin || location.hash === '#login';
    if (shouldScrollToLogin) {
      window.requestAnimationFrame(() => {
        document.getElementById('login')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [location.hash, location.state]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userId = params.get('userId');
    const fullName = params.get('fullName');
    const email = params.get('email');
    const role = params.get('role');
    const redirectPath = params.get('redirectPath') || '/';

    if (!token || !email) {
      return;
    }

    applySession({
      token,
      userId,
      fullName,
      email,
      role,
      redirectPath,
    });

    const cleanPath = redirectPath === '/admin/dashboard' ? '/admin/dashboard' : redirectPath;
    navigate(cleanPath, { replace: true });
  }, [applySession, location.search, navigate]);

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

  useEffect(() => {
    const loadOAuthAvailability = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/oauth/google/enabled`);
        if (!response.ok) {
          setGoogleOAuthEnabled(false);
          return;
        }

        const data = await response.json();
        setGoogleOAuthEnabled(Boolean(data?.enabled));
      } catch {
        setGoogleOAuthEnabled(false);
      }
    };

    loadOAuthAvailability();
  }, [API_BASE_URL]);

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setLoginState({ loading: true, error: '' });

    try {
      const response = await login(loginForm);
      navigate(response.redirectPath || '/', { replace: true });
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.details ||
        'Unable to log in right now.';

      window.alert(errorMessage);
      setLoginState({
        loading: false,
        error: errorMessage,
      });
      return;
    }

    setLoginState({ loading: false, error: '' });
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
    setMenuOpen(false);
  };

  const getDisplayName = () => {
    if (!user?.fullName) {
      return 'Account';
    }

    const parts = user.fullName.trim().split(/\s+/);
    return parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1]}` : parts[0];
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
              <a href="/" className="smoothScroll">Home</a>
              <a href="#about" className="smoothScroll">About</a>
              <a href="#feature" className="smoothScroll">Features</a>
              <Link to="/resources" onClick={() => setMenuOpen(false)}>Resources</Link>
              <Link to="/bookings" onClick={() => setMenuOpen(false)}>Bookings</Link>
              <a href="#testimonial" className="smoothScroll">Reviews</a>
              <a href="#faq" className="smoothScroll">FAQ</a>
              {isAuthenticated ? (
                <>
                  {hasRole(['ADMIN', 'TECHNICIAN']) && (
                    <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                  )}
                  <Link to="/profile" onClick={() => setMenuOpen(false)} className="sc-user-name" title={user?.fullName || 'Profile'}>
                    <FaUserCircle style={{ marginRight: 8 }} />
                    {getDisplayName()}
                  </Link>
                  <button type="button" className="sc-auth-link" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <a href="#login" className="smoothScroll" onClick={() => setMenuOpen(false)}>
                  Log In
                </a>
              )}
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
              <div className="modern-card login-card" id="login">
                <h3>Login to Dashboard</h3>
                <p>Access your campus system account securely.</p>

                {location.state?.authMessage && (
                  <div className="login-inline-alert">
                    {location.state.authMessage}
                  </div>
                )}

                {loginState.error && (
                  <div className="login-inline-alert danger">
                    {loginState.error}
                  </div>
                )}

                <form onSubmit={handleLoginSubmit}>
                  <input
                    type="text"
                    className="modern-input"
                    placeholder="Full name"
                    name="fullName"
                    value={loginForm.fullName}
                    onChange={handleLoginChange}
                    required
                  />
                  <input
                    type="email"
                    className="modern-input"
                    placeholder="University email"
                    name="email"
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    required
                  />
                  <input
                    type="password"
                    className="modern-input"
                    placeholder="Password"
                    name="password"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    required
                  />
                  <Button className="w-100 modern-btn" variant="primary" type="submit" disabled={loginState.loading}>
                    {loginState.loading ? 'Logging In...' : 'Log In'}
                  </Button>
                </form>

                {googleOAuthEnabled && (
                  <Button
                    type="button"
                    variant="light"
                    className="w-100 mt-3 oauth-btn"
                    onClick={() => {
                      window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
                    }}
                  >
                    Continue with Google
                  </Button>
                )}

                <div className="login-note">
                  <Link to="/register" className="login-register-link">
                    Don&apos;t have an account? Register here
                  </Link>
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

      <section id="faq" className="section-block section-light">
        <Container>
          <div className="section-header text-center">
            <span className="section-label">Frequently Asked Questions</span>
            <h2>Common questions about the platform</h2>
            <p>
              Here are some quick answers about how CampusCore supports campus resource
              management and operations.
            </p>
          </div>

          <Row>
            {faqs.map((faq, index) => (
              <Col key={index} lg={6} md={12} className="mb-4">
                <div className="modern-card faq-card">
                  <div className="faq-icon">
                    <i className="fa fa-question-circle" />
                  </div>
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;
