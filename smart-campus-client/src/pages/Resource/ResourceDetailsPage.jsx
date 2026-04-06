import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Badge, Alert, Spinner, Row, Col } from 'react-bootstrap';
import resourceApi from "../../api/resourceApi";

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
        navigate('/');
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
      <div className="loading-spinner">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Oops! Something went wrong</Alert.Heading>
        <p>{error}</p>
        <Button variant="outline-danger" onClick={fetchResource}>
          Try Again
        </Button>
      </Alert>
    );
  }

  if (!resource) {
    return (
      <Alert variant="warning">
        <Alert.Heading>Resource not found</Alert.Heading>
        <p>The resource you're looking for doesn't exist.</p>
        <Button variant="outline-warning" onClick={() => navigate('/')}>
          Back to Resources
        </Button>
      </Alert>
    );
  }

  return (
    <div>
      <Button variant="outline-secondary" onClick={() => navigate(-1)} className="mb-3">
        ← Back
      </Button>

      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h3 className="mb-0">
            {getTypeIcon(resource.type)} {resource.name}
          </h3>
          <span className={getStatusClass(resource.status)}>
            {resource.status.replace('_', ' ')}
          </span>
        </Card.Header>
        
        <Card.Body>
          <div className="mb-4">
            <span className={getSuitabilityBadgeClass(resource.suitabilityBadge)}>
              {resource.suitabilityBadge}
            </span>
          </div>

          <Row className="mb-4">
            <Col md={6}>
              <h5>Basic Information</h5>
              <p><strong>Type:</strong> {resource.type.replace('_', ' ')}</p>
              <p><strong>Capacity:</strong> {resource.capacity} people</p>
              <p><strong>Location:</strong> {resource.location}</p>
              <p><strong>Status:</strong> {resource.status.replace('_', ' ')}</p>
            </Col>
            
            <Col md={6}>
              <h5>Availability</h5>
              {resource.availableFrom && resource.availableTo ? (
                <>
                  <p><strong>Available From:</strong> {resource.availableFrom}</p>
                  <p><strong>Available To:</strong> {resource.availableTo}</p>
                </>
              ) : (
                <p className="text-muted">No availability information</p>
              )}
            </Col>
          </Row>

          {resource.description && (
            <div className="mb-4">
              <h5>Description</h5>
              <p>{resource.description}</p>
            </div>
          )}

          <div className="mb-4">
            <h5>System Information</h5>
            <p><strong>Created:</strong> {new Date(resource.createdAt).toLocaleString()}</p>
            <p><strong>Last Updated:</strong> {new Date(resource.updatedAt).toLocaleString()}</p>
          </div>

          <div className="d-flex gap-2">
            <Button variant="primary" onClick={() => navigate(`/resources/edit/${resource.id}`)}>
              ✏️ Edit Resource
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              🗑️ Delete Resource
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ResourceDetailsPage;
