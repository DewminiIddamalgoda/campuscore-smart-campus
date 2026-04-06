import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

const ResourceFilter = ({ onFilter, onReset }) => {
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    minCapacity: '',
    status: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters({
      type: '',
      location: '',
      minCapacity: '',
      status: ''
    });
    onReset();
  };

  return (
    <div className="resource-filter">
      <div className="filter-header">
        <h3 className="filter-title">
          <i className="fa fa-search me-2"></i>
          Search & Filter Resources
        </h3>
        <p className="filter-subtitle">
          Find the perfect campus resource by type, location, capacity, or status
        </p>
      </div>
      
      <Form onSubmit={handleSubmit} className="filter-form">
        <Row className="g-3">
          <Col md={3}>
            <Form.Group className="filter-group">
              <Form.Label className="filter-label">
                <i className="fa fa-building me-1"></i>
                Resource Type
              </Form.Label>
              <Form.Select 
                name="type" 
                value={filters.type} 
                onChange={handleChange}
                className="modern-input"
              >
                <option value="">All Types</option>
                <option value="LECTURE_HALL">🎓 Lecture Hall</option>
                <option value="LAB">🔬 Lab</option>
                <option value="MEETING_ROOM">👥 Meeting Room</option>
                <option value="EQUIPMENT">📦 Equipment</option>
              </Form.Select>
            </Form.Group>
          </Col>
          
          <Col md={3}>
            <Form.Group className="filter-group">
              <Form.Label className="filter-label">
                <i className="fa fa-map-marker me-1"></i>
                Location
              </Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={filters.location}
                onChange={handleChange}
                placeholder="Enter location"
                className="modern-input"
              />
            </Form.Group>
          </Col>
          
          <Col md={2}>
            <Form.Group className="filter-group">
              <Form.Label className="filter-label">
                <i className="fa fa-users me-1"></i>
                Min Capacity
              </Form.Label>
              <Form.Control
                type="number"
                name="minCapacity"
                value={filters.minCapacity}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="modern-input"
              />
            </Form.Group>
          </Col>
          
          <Col md={2}>
            <Form.Group className="filter-group">
              <Form.Label className="filter-label">
                <i className="fa fa-info-circle me-1"></i>
                Status
              </Form.Label>
              <Form.Select 
                name="status" 
                value={filters.status} 
                onChange={handleChange}
                className="modern-input"
              >
                <option value="">All Status</option>
                <option value="ACTIVE">✅ Active</option>
                <option value="OUT_OF_SERVICE">❌ Out of Service</option>
              </Form.Select>
            </Form.Group>
          </Col>
          
          <Col md={2} className="d-flex align-items-end">
            <div className="filter-actions">
              <Button type="submit" className="primary-btn w-100 mb-2">
                <i className="fa fa-search me-2"></i>Search
              </Button>
              <Button type="button" className="secondary-btn w-100" onClick={handleReset}>
                <i className="fa fa-refresh me-2"></i>Reset
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default ResourceFilter;
