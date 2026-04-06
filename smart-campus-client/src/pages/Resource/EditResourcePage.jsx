import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert, Spinner, Row, Col } from 'react-bootstrap';
import resourceApi from "../../api/resourceApi";

const EditResourcePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    type: 'LECTURE_HALL',
    capacity: '',
    location: '',
    status: 'ACTIVE',
    availableFrom: '',
    availableTo: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  console.log('EditResourcePage rendered with ID:', id);

  useEffect(() => {
    fetchResource();
  }, [id]);

  const fetchResource = async () => {
    try {
      setLoading(true);
      const data = await resourceApi.getResourceById(id);
      setFormData({
        name: data.name,
        type: data.type,
        capacity: data.capacity.toString(),
        location: data.location,
        status: data.status,
        availableFrom: data.availableFrom || '',
        availableTo: data.availableTo || '',
        description: data.description || ''
      });
      setError(null);
    } catch (err) {
      setError('Failed to fetch resource details. Please try again later.');
      console.error('Error fetching resource:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const resourceData = {
        ...formData,
        capacity: parseInt(formData.capacity)
      };
      
      await resourceApi.updateResource(id, resourceData);
      navigate(`/resources/${id}`);
    } catch (err) {
      setError('Failed to update resource. Please check your input and try again.');
      console.error('Error updating resource:', err);
    } finally {
      setSubmitting(false);
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

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>✏️ Edit Resource</h2>
        <Button variant="outline-secondary" onClick={() => navigate(`/resources/${id}`)}>
          Cancel
        </Button>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group controlId="name">
                  <Form.Label>Resource Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Lab A-401"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="type">
                  <Form.Label>Resource Type *</Form.Label>
                  <Form.Select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="LECTURE_HALL">Lecture Hall</option>
                    <option value="LAB">Lab</option>
                    <option value="MEETING_ROOM">Meeting Room</option>
                    <option value="EQUIPMENT">Equipment</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="capacity">
                  <Form.Label>Capacity *</Form.Label>
                  <Form.Control
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    required
                    min="1"
                    placeholder="e.g., 40"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="location">
                  <Form.Label>Location *</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    placeholder="e.g., 4th Floor, Block A"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="status">
                  <Form.Label>Status *</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="OUT_OF_SERVICE">Out of Service</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group controlId="availableFrom">
                  <Form.Label>Available From</Form.Label>
                  <Form.Control
                    type="time"
                    name="availableFrom"
                    value={formData.availableFrom}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group controlId="availableTo">
                  <Form.Label>Available To</Form.Label>
                  <Form.Control
                    type="time"
                    name="availableTo"
                    value={formData.availableTo}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group controlId="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Enter resource description..."
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <div className="d-flex gap-2">
                  <Button type="submit" variant="primary" disabled={submitting}>
                    {submitting ? 'Updating...' : '💾 Update Resource'}
                  </Button>
                  <Button type="button" variant="outline-secondary" onClick={() => navigate(`/resources/${id}`)}>
                    Cancel
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default EditResourcePage;
