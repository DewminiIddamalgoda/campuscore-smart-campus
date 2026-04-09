import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Row, Col } from 'react-bootstrap';
import resourceApi from "../../api/resourceApi";
import './Resources.css';

const ResourceDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('ResourceDetailsPage rendered with ID:', id);

  useEffect(() => {
    fetchResource();
  }, [id]);

  const fetchResource = async () => {
    try {
      console.log('Fetching resource with ID:', id);
      setLoading(true);
      const data = await resourceApi.getResourceById(id);
      console.log('Resource data received:', data);
      setResource(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch resource details. Please try again later.');
      console.error('Error fetching resource:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await resourceApi.deleteResource(id);
        navigate('/resources');
      } catch (err) {
        setError('Failed to delete resource. Please try again later.');
        console.error('Error deleting resource:', err);
      }
    }
  };

  const getSuitabilityBadgeClass = (badge) => {
    if (badge.includes('Best for')) return 'suitability-badge suitability-best';
    if (badge.includes('Limited')) return 'suitability-badge suitability-limited';
    if (badge.includes('unavailable')) return 'suitability-badge suitability-unavailable';
    return 'suitability-badge suitability-available';
  };

  const getStatusClass = (status) => {
    return status === 'ACTIVE' ? 'status-active' : 'status-out-of-service';
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'LECTURE_HALL': return '🎓';
      case 'LAB': return '🔬';
      case 'MEETING_ROOM': return '👥';
      case 'EQUIPMENT': return '📦';
      default: return '🏢';
    }
  };

  if (loading) {
    return (
      <div className="resources-page">
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading resource details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="resources-page">
        <Container>
          <div className="error-alert">
            <h3 className="mb-2">⚠️ Unable to Load Resource</h3>
            <p className="mb-3">{error}</p>
            <Button className="primary-btn" onClick={fetchResource}>
              Try Again
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="resources-page">
        <Container>
          <div className="no-resources">
            <h3>Resource Not Found</h3>
            <p>The resource you're looking for doesn't exist.</p>
            <Button className="primary-btn" onClick={() => navigate('/resources')}>
              Back to Resources
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="resources-page">
      {/* Header Section */}
      <section className="resources-header">
        <Container>
          <div className="resources-header-content">
            <div className="d-flex align-items-center gap-3 mb-3">
              <Button className="secondary-btn" onClick={() => navigate('/resources')}>
                <i className="fa fa-arrow-left me-2"></i>Back to Resources
              </Button>
              <span className={`resource-status-badge ${getStatusClass(resource.status)}`}>
                {resource.status.replace('_', ' ')}
              </span>
            </div>
            <h1 className="d-flex align-items-center gap-3">
              <span className="resource-type-icon">{getTypeIcon(resource.type)}</span>
              {resource.name}
            </h1>
            <p>
              {resource.type.replace('_', ' ')} • {resource.capacity} people capacity • {resource.location}
            </p>
            <div className="resources-actions">
              <Button className="primary-btn" onClick={() => navigate(`/resources/edit/${resource.id}`)}>
                <i className="fa fa-edit me-2"></i>Edit Resource
              </Button>
              <Button className="secondary-btn" onClick={handleDelete}>
                <i className="fa fa-trash me-2"></i>Delete Resource
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Content Section */}
      <section className="resources-content">
        <Container>
          <div className="suitability-badge mb-4">
            <span className={getSuitabilityBadgeClass(resource.suitabilityBadge)}>
              {resource.suitabilityBadge}
            </span>
          </div>

          <Row className="g-4">
            <Col lg={6} md={12}>
              <div className="modern-card">
                <div className="card-header-modern">
                  <h3 className="h4">
                    <i className="fa fa-info-circle me-2"></i>
                    Basic Information
                  </h3>
                </div>
                <div className="card-body-modern">
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">
                        <i className="fa fa-building me-2"></i>Type
                      </span>
                      <span className="info-value">{resource.type.replace('_', ' ')}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">
                        <i className="fa fa-users me-2"></i>Capacity
                      </span>
                      <span className="info-value">{resource.capacity} people</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">
                        <i className="fa fa-map-marker me-2"></i>Location
                      </span>
                      <span className="info-value">{resource.location}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">
                        <i className="fa fa-info-circle me-2"></i>Status
                      </span>
                      <span className="info-value">{resource.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            
            <Col lg={6} md={12}>
              <div className="modern-card">
                <div className="card-header-modern">
                  <h3 className="h4">
                    <i className="fa fa-clock-o me-2"></i>
                    Availability
                  </h3>
                </div>
                <div className="card-body-modern">
                  {resource.availableFrom && resource.availableTo ? (
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-label">
                          <i className="fa fa-calendar me-2"></i>Available From
                        </span>
                        <span className="info-value">{resource.availableFrom}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">
                          <i className="fa fa-calendar me-2"></i>Available To
                        </span>
                        <span className="info-value">{resource.availableTo}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted">No availability information</p>
                  )}
                </div>
              </div>
            </Col>
          </Row>

          {resource.description && (
            <div className="modern-card mt-4">
              <div className="card-header-modern">
                <h3 className="h4">
                  <i className="fa fa-file-text me-2"></i>
                  Description
                </h3>
              </div>
              <div className="card-body-modern">
                <p className="description-text">{resource.description}</p>
              </div>
            </div>
          )}

          <div className="modern-card mt-4">
            <div className="card-header-modern">
              <h3 className="h4">
                <i className="fa fa-cog me-2"></i>
                System Information
              </h3>
            </div>
            <div className="card-body-modern">
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">
                    <i className="fa fa-plus-circle me-2"></i>Created
                  </span>
                  <span className="info-value">{new Date(resource.createdAt).toLocaleString()}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">
                    <i className="fa fa-edit me-2"></i>Last Updated
                  </span>
                  <span className="info-value">{new Date(resource.updatedAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default ResourceDetailsPage;
