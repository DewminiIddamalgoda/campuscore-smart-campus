import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ResourceCard from '../../components/ResourceCard';
import ResourceFilter from '../../components/ResourceFilter';
import resourceApi from "../../api/resourceApi";
import './Resources.css';

const ResourceListPage = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const data = await resourceApi.getAllResources();
      setResources(data);
      setFilteredResources(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch resources. Please try again later.');
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async (filters) => {
    try {
      setLoading(true);
      const hasFilters = Object.values(filters).some(value => value !== '');
      
      if (hasFilters) {
        const data = await resourceApi.searchResources(filters);
        setFilteredResources(data);
      } else {
        setFilteredResources(resources);
      }
      setError(null);
    } catch (err) {
      setError('Failed to search resources. Please try again later.');
      console.error('Error searching resources:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilteredResources(resources);
  };

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

  if (loading) {
    return (
      <div className="resources-page">
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading resources...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="resources-page">
        <div className="container">
          <div className="error-alert">
            <h3 className="mb-2">⚠️ Unable to Load Resources</h3>
            <p className="mb-3">{error}</p>
            <Button className="primary-btn" onClick={fetchResources}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="resources-page">
      {/* Navbar - Same as HomePage */}
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

      {/* Header Section */}
      <section id="home" className="resources-header">
        <Container>
          <div className="resources-header-content">
            <h1>CampusCore Resources</h1>
            <p>
              Discover and manage campus facilities, lecture halls, labs, meeting rooms, 
              and equipment through our smart resource management system.
            </p>
            <div className="resources-actions">
              <Button className="primary-btn" onClick={() => navigate('/resources/add')}>
                <i className="fa fa-plus me-2"></i>Add Resource
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Content Section */}
      <section className="resources-content">
        <Container>
          {/* Filter Section */}
          <div className="resources-filter-section">
            <div className="filter-card">
              <ResourceFilter onFilter={handleFilter} onReset={handleReset} />
            </div>
          </div>

          {/* Results Section */}
          {filteredResources.length === 0 ? (
            <div className="no-resources">
              <h3>No Resources Found</h3>
              <p>Try adjusting your search filters or check back later for available resources.</p>
              <Button className="primary-btn" onClick={handleReset}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <h3 className="h4 mb-2">
                  Found {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''}
                </h3>
                <p className="text-muted">
                  Browse through our available campus resources and find the perfect match for your needs.
                </p>
              </div>
              
              <Row xs={1} md={2} lg={3} xl={4} className="resources-grid">
                {filteredResources.map((resource) => (
                  <Col key={resource.id}>
                    <ResourceCard resource={resource} />
                  </Col>
                ))}
              </Row>
            </>
          )}
        </Container>
      </section>
    </div>
  );
};

export default ResourceListPage;
