import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import ResourceCard from '../../components/resources/ResourceCard';
import ResourceFilter from '../../components/resources/ResourceFilter';
import resourceApi from "../../api/resourceApi";
import './Resources.css';

const ResourceListPage = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const filterRef = useRef();

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

  const handleFilterChange = (filters) => {
    // Apply filters to resources using the filter function from ResourceFilter
    if (filters.filterFunction && resources.length > 0) {
      const filtered = filters.filterFunction(resources);
      setFilteredResources(filtered);
    } else {
      setFilteredResources(resources);
    }
  };

  const handleReset = () => {
    setFilteredResources(resources);
  };

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
    <div className="resources-page py-4">
      <Container fluid>
        {/* Header Section */}
        <div className="mb-5">
          <h1 className="display-4 fw-bold mb-3">
            <FaSearch className="text-primary me-3" />
            Campus Resources
          </h1>
          <p className="lead text-muted mb-4">
            Discover and explore campus facilities, lecture halls, labs, meeting rooms, and equipment
          </p>
        </div>

        {/* Filter Section */}
        <div className="mb-4">
          <div className="bg-light p-4 rounded-3 shadow-sm">
            <h5 className="mb-3">
              <FaFilter className="me-2" />
              Filter Resources
            </h5>
            <ResourceFilter onFilter={handleFilterChange} onReset={handleReset} />
          </div>
        </div>

        {/* Results Section */}
        {error && (
          <Alert variant="danger" className="mb-4">
            <Alert.Heading>Error Loading Resources</Alert.Heading>
            <p>{error}</p>
            <Button variant="outline-danger" onClick={fetchResources}>
              Try Again
            </Button>
          </Alert>
        )}

        {filteredResources.length === 0 && !error ? (
          <div className="text-center py-5">
            <h3 className="text-muted mb-3">No Resources Found</h3>
            <p className="text-muted mb-4">
              Try adjusting your search filters or check back later for available resources.
            </p>
            <Button variant="outline-primary" onClick={handleReset}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <h4 className="fw-semibold">
                Found {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''}
              </h4>
              <p className="text-muted mb-0">
                Browse through our available campus resources and find the perfect match for your needs.
              </p>
            </div>
            
            <Row xs={1} md={2} lg={3} xl={4} className="g-4">
              {filteredResources.map((resource) => (
                <Col key={resource.id}>
                  <ResourceCard resource={resource} />
                </Col>
              ))}
            </Row>
          </>
        )}
      </Container>
    </div>
  );
};

export default ResourceListPage;
