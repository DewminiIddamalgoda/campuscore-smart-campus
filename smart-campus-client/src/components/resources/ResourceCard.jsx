import React from 'react';
import { Button } from 'react-bootstrap';
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
      case 'LECTURE_HALL': return '';
      case 'LAB': return '';
      case 'MEETING_ROOM': return '';
      case 'EQUIPMENT': return '';
      default: return '';
    }
  };

  const handleViewDetails = () => {
    console.log('View Details clicked for resource:', resource.id);
    console.log('Navigating to:', `/resources/${resource.id}`);
    navigate(`/resources/${resource.id}`);
  };

    const handleBooking = () => {
      console.log('Booking clicked for resource:', resource.id);
      console.log('Navigating to:', `/bookings?resourceId=${resource.id}`);
      navigate(`/bookings?resourceId=${encodeURIComponent(resource.id)}`, {
        state: { selectedResourceId: resource.id }
      });
    };

  return (
    <div className="resource-card-modern">
      <div className="resource-card-header">
        <h3 className="resource-card-title">
          <span className="resource-type-icon">{getTypeIcon(resource.type)}</span>
          {resource.name}
        </h3>
        <span className={`resource-status-badge ${getStatusClass(resource.status)}`}>
          {resource.status.replace('_', ' ')}
        </span>
      </div>
      
      <div className="resource-card-body">
        <div className="suitability-badge">
          <span className={getSuitabilityBadgeClass(resource.suitabilityBadge)}>
            {resource.suitabilityBadge}
          </span>
        </div>
        
        <div className="resource-info">
          <div className="resource-info-item">
            <i className="fa fa-building"></i>
            <span>{resource.type.replace('_', ' ')}</span>
          </div>
          <div className="resource-info-item">
            <i className="fa fa-map-marker"></i>
            <span>{resource.location}</span>
          </div>
          <div className="resource-info-item">
            <i className="fa fa-users"></i>
            <span>{resource.capacity} people capacity</span>
          </div>
          {resource.availableFrom && resource.availableTo && (
            <div className="resource-info-item">
              <i className="fa fa-clock-o"></i>
              <span>{resource.availableFrom} - {resource.availableTo}</span>
            </div>
          )}
        </div>
        
        {resource.description && (
          <p className="text-muted small">
            {resource.description.length > 120 
              ? `${resource.description.substring(0, 120)}...` 
              : resource.description}
          </p>
        )}
      </div>
      
      <div className="resource-card-actions">
        <Button 
          className="primary-btn"
          onClick={handleViewDetails}
        >
          <i className="fa fa-eye me-2"></i>View Details
        </Button>
        <Button
          className="secondary-btn"
          onClick={handleBooking}
        >
          <i className="fa fa-calendar-check me-2"></i>Book Now
        </Button>
      </div>
    </div>
  );
};

export default ResourceCard;
