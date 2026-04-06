import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ResourceCard = ({ resource }) => {
  const navigate = useNavigate();

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

  const handleViewDetails = () => {
    console.log('View Details clicked for resource:', resource.id);
    console.log('Navigating to:', `/resources/${resource.id}`);
    navigate(`/resources/${resource.id}`);
  };

  const handleEdit = () => {
    console.log('Edit clicked for resource:', resource.id);
    console.log('Navigating to:', `/resources/edit/${resource.id}`);
    navigate(`/resources/edit/${resource.id}`);
  };

  return (
    <Card className="resource-card h-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="h5 mb-0">
            {getTypeIcon(resource.type)} {resource.name}
          </Card.Title>
          <span className={getStatusClass(resource.status)}>
            {resource.status.replace('_', ' ')}
          </span>
        </div>
        
        <Card.Subtitle className="mb-2 text-muted">
          {resource.type.replace('_', ' ')}
        </Card.Subtitle>
        
        <div className="mb-3">
          <div className="suitability-badge mb-2">
            <span className={getSuitabilityBadgeClass(resource.suitabilityBadge)}>
              {resource.suitabilityBadge}
            </span>
          </div>
        </div>
        
        <div className="resource-details mb-3">
          <div className="mb-1">
            <strong>📍 Location:</strong> {resource.location}
          </div>
          <div className="mb-1">
            <strong>👥 Capacity:</strong> {resource.capacity} people
          </div>
          {resource.availableFrom && resource.availableTo && (
            <div className="mb-1">
              <strong>⏰ Available:</strong> {resource.availableFrom} - {resource.availableTo}
            </div>
          )}
        </div>
        
        {resource.description && (
          <Card.Text className="text-muted small">
            {resource.description.length > 100 
              ? `${resource.description.substring(0, 100)}...` 
              : resource.description}
          </Card.Text>
        )}
        
        <div className="d-flex justify-content-between">
          <Button 
            variant="outline-primary" 
            size="sm"
            onClick={handleViewDetails}
          >
            View Details
          </Button>
          <Button 
            variant="outline-secondary" 
            size="sm"
            onClick={handleEdit}
          >
            Edit
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ResourceCard;
