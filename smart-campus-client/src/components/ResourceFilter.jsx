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
    <div className="filter-section">
      <h5 className="mb-3">🔍 Search & Filter Resources</h5>
      <Form onSubmit={handleSubmit}>
        <Row className="g-3">
          <Col md={3}>
            <Form.Group>
              <Form.Label>Resource Type</Form.Label>
              <Form.Select name="type" value={filters.type} onChange={handleChange}>
                <option value="">All Types</option>
                <option value="LECTURE_HALL">Lecture Hall</option>
                <option value="LAB">Lab</option>
                <option value="MEETING_ROOM">Meeting Room</option>
                <option value="EQUIPMENT">Equipment</option>
              </Form.Select>
            </Form.Group>
          </Col>
          
          <Col md={3}>
            <Form.Group>
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={filters.location}
                onChange={handleChange}
                placeholder="Enter location"
              />
            </Form.Group>
          </Col>
          
          <Col md={2}>
            <Form.Group>
              <Form.Label>Min Capacity</Form.Label>
              <Form.Control
                type="number"
                name="minCapacity"
                value={filters.minCapacity}
                onChange={handleChange}
                placeholder="0"
                min="0"
              />
            </Form.Group>
          </Col>
          
          <Col md={2}>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Select name="status" value={filters.status} onChange={handleChange}>
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="OUT_OF_SERVICE">Out of Service</option>
              </Form.Select>
            </Form.Group>
          </Col>
          
          <Col md={2} className="d-flex align-items-end">
            <div className="d-flex gap-2">
              <Button type="submit" variant="primary">
                🔍 Search
              </Button>
              <Button type="button" variant="outline-secondary" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default ResourceFilter;
