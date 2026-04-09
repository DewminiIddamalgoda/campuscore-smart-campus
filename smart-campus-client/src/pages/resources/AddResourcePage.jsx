import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import resourceApi from "../../api/resourceApi";
import './Resources.css';

const AddResourcePage = () => {
  console.log('AddResourcePage component rendered');
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const resourceData = {
        ...formData,
        capacity: parseInt(formData.capacity)
      };
      
      await resourceApi.createResource(resourceData);
      navigate('/resources');
    } catch (err) {
      setError('Failed to create resource. Please check your input and try again.');
      console.error('Error creating resource:', err);
    } finally {
      setLoading(false);
    }
  };

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
            </div>
            <h1>
              <i className="fa fa-plus me-3"></i>
              Add New Resource
            </h1>
            <p>
              Create a new campus resource to manage facilities, equipment, or spaces
            </p>
          </div>
        </Container>
      </section>

      {/* Content Section */}
      <section className="resources-content">
        <Container>
          <div className="modern-card">
            <div className="card-header-modern">
              <h3 className="h4">
                <i className="fa fa-plus-circle me-2"></i>
                Resource Information
              </h3>
              <p className="text-muted mb-0">
                Fill in the details below to add a new resource to the system
              </p>
            </div>
            <div className="card-body-modern">
              {error && (
                <div className="error-alert mb-4">
                  <h4 className="mb-2">⚠️ Error</h4>
                  <p className="mb-0">{error}</p>
                </div>
              )}

              <Form onSubmit={handleSubmit}>
                <Row className="g-4">
                  <Col md={6}>
                    <Form.Group controlId="name">
                      <Form.Label className="form-label-modern">
                        <i className="fa fa-tag me-2"></i>
                        Resource Name *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Lab A-401"
                        className="modern-input"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="type">
                      <Form.Label className="form-label-modern">
                        <i className="fa fa-building me-2"></i>
                        Resource Type *
                      </Form.Label>
                      <Form.Select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                        className="modern-input"
                      >
                        <option value="LECTURE_HALL">🎓 Lecture Hall</option>
                        <option value="LAB">🔬 Laboratory</option>
                        <option value="MEETING_ROOM">👥 Meeting Room</option>
                        <option value="EQUIPMENT">📦 Equipment</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="capacity">
                      <Form.Label className="form-label-modern">
                        <i className="fa fa-users me-2"></i>
                        Capacity *
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                        required
                        placeholder="e.g., 50"
                        min="1"
                        className="modern-input"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="location">
                      <Form.Label className="form-label-modern">
                        <i className="fa fa-map-marker me-2"></i>
                        Location *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Building A, Floor 4"
                        className="modern-input"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="status">
                      <Form.Label className="form-label-modern">
                        <i className="fa fa-info-circle me-2"></i>
                        Status
                      </Form.Label>
                      <Form.Select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="modern-input"
                      >
                        <option value="ACTIVE">✅ Active</option>
                        <option value="OUT_OF_SERVICE">❌ Out of Service</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="availableFrom">
                      <Form.Label className="form-label-modern">
                        <i className="fa fa-clock-o me-2"></i>
                        Available From
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="availableFrom"
                        value={formData.availableFrom}
                        onChange={handleChange}
                        placeholder="e.g., 09:00"
                        className="modern-input"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="availableTo">
                      <Form.Label className="form-label-modern">
                        <i className="fa fa-clock-o me-2"></i>
                        Available To
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="availableTo"
                        value={formData.availableTo}
                        onChange={handleChange}
                        placeholder="e.g., 17:00"
                        className="modern-input"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group controlId="description">
                      <Form.Label className="form-label-modern">
                        <i className="fa fa-file-text me-2"></i>
                        Description
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter a detailed description of the resource..."
                        rows={4}
                        className="modern-input modern-textarea"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="form-actions mt-4">
                  <Button 
                    type="submit" 
                    className="primary-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Creating...
                      </>
                    ) : (
                      <>
                        <i className="fa fa-plus me-2"></i>
                        Create Resource
                      </>
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    className="secondary-btn"
                    onClick={() => navigate('/resources')}
                  >
                    <i className="fa fa-times me-2"></i>
                    Cancel
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default AddResourcePage;
