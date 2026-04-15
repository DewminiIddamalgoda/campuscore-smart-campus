import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import resourceApi from "../../api/resourceApi";

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
  const [fieldErrors, setFieldErrors] = useState({});

  // Validation function
  const validateForm = () => {
    const errors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Resource name is required';
    } else if (formData.name.length < 3) {
      errors.name = 'Resource name must be at least 3 characters long';
    } else if (formData.name.length > 100) {
      errors.name = 'Resource name must not exceed 100 characters';
    }
    
    // Capacity validation
    if (!formData.capacity) {
      errors.capacity = 'Capacity is required';
    } else if (isNaN(formData.capacity) || parseInt(formData.capacity) < 1) {
      errors.capacity = 'Capacity must be a positive number';
    } else if (parseInt(formData.capacity) > 1000) {
      errors.capacity = 'Capacity must not exceed 1000';
    }
    
    // Location validation
    if (!formData.location.trim()) {
      errors.location = 'Location is required';
    } else if (formData.location.length < 3) {
      errors.location = 'Location must be at least 3 characters long';
    } else if (formData.location.length > 200) {
      errors.location = 'Location must not exceed 200 characters';
    }
    
    // Time validation
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (formData.availableFrom && !timeRegex.test(formData.availableFrom)) {
      errors.availableFrom = 'Available From must be in HH:MM format (e.g., 09:00)';
    }
    if (formData.availableTo && !timeRegex.test(formData.availableTo)) {
      errors.availableTo = 'Available To must be in HH:MM format (e.g., 17:00)';
    }
    if (formData.availableFrom && formData.availableTo) {
      const from = formData.availableFrom.split(':');
      const to = formData.availableTo.split(':');
      const fromMinutes = parseInt(from[0]) * 60 + parseInt(from[1]);
      const toMinutes = parseInt(to[0]) * 60 + parseInt(to[1]);
      if (fromMinutes >= toMinutes) {
        errors.availableTo = 'Available To must be later than Available From';
      }
    }
    
    // Description validation
    if (formData.description && formData.description.length > 500) {
      errors.description = 'Description must not exceed 500 characters';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
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
    setError(null);
    
    // Validate form
    if (!validateForm()) {
      setError('Please fix the validation errors before submitting.');
      return;
    }

    setLoading(true);

    try {
      const resourceData = {
        ...formData,
        capacity: parseInt(formData.capacity)
      };
      
      await resourceApi.createResource(resourceData);
      navigate('/admin/resources');
    } catch (err) {
      setError('Failed to create resource. Please check your input and try again.');
      console.error('Error creating resource:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header Section */}
      <section>
        <Container>
          <div>
            <div className="d-flex align-items-center gap-3 mb-3">
              <Button variant="secondary" onClick={() => navigate('/admin/resources')}>
                Back
              </Button>
            </div>
            <h1>
              Add New Resource
            </h1>
            <p>
              Create a new campus resource to manage facilities, equipment, or spaces
            </p>
          </div>
        </Container>
      </section>

      {/* Content Section */}
      <section>
        <Container>
          <div>
            <div>
              <h3>
                Resource Information
              </h3>
              <p>
                Fill in the details below to add a new resource to the system
              </p>
            </div>
            <div>
              {error && (
                <div className="alert alert-danger mb-4" role="alert">
                  <div className="d-flex align-items-center">
                    <i className="fa fa-exclamation-triangle me-2"></i>
                    <div>
                      <strong>Validation Error:</strong>
                      <div className="mt-1">{error}</div>
                    </div>
                  </div>
                </div>
              )}

              <Form onSubmit={handleSubmit}>
                <Row className="g-4">
                  <Col md={6}>
                    <Form.Group controlId="name">
                      <Form.Label>
                        Resource Name *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g., Lab A-401"
                        className={fieldErrors.name ? 'is-invalid' : ''}
                      />
                      {fieldErrors.name && (
                        <Form.Text className="text-danger">
                          {fieldErrors.name}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="type">
                      <Form.Label>
                        Resource Type *
                      </Form.Label>
                      <Form.Select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                      >
                        <option value="LECTURE_HALL">Lecture Hall</option>
                        <option value="LAB">Laboratory</option>
                        <option value="MEETING_ROOM">Meeting Room</option>
                        <option value="EQUIPMENT">Equipment</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="capacity">
                      <Form.Label>
                        Capacity *
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                        placeholder="e.g., 50"
                        min="1"
                        className={fieldErrors.capacity ? 'is-invalid' : ''}
                      />
                      {fieldErrors.capacity && (
                        <Form.Text className="text-danger">
                          {fieldErrors.capacity}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="location">
                      <Form.Label>
                        Location *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g., Building A, Floor 4"
                        className={fieldErrors.location ? 'is-invalid' : ''}
                      />
                      {fieldErrors.location && (
                        <Form.Text className="text-danger">
                          {fieldErrors.location}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="status">
                      <Form.Label>
                        Status
                      </Form.Label>
                      <Form.Select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option value="ACTIVE"> Active</option>
                        <option value="OUT_OF_SERVICE">❌Out of Service</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="availableFrom">
                      <Form.Label>
                        Available From
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="availableFrom"
                        value={formData.availableFrom}
                        onChange={handleChange}
                        placeholder="e.g., 09:00"
                        className={fieldErrors.availableFrom ? 'is-invalid' : ''}
                      />
                      {fieldErrors.availableFrom && (
                        <Form.Text className="text-danger">
                          {fieldErrors.availableFrom}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="availableTo">
                      <Form.Label>
                        Available To
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="availableTo"
                        value={formData.availableTo}
                        onChange={handleChange}
                        placeholder="e.g., 17:00"
                        className={fieldErrors.availableTo ? 'is-invalid' : ''}
                      />
                      {fieldErrors.availableTo && (
                        <Form.Text className="text-danger">
                          {fieldErrors.availableTo}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group controlId="description">
                      <Form.Label>
                        Description
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter a detailed description of resource..."
                        rows={4}
                        className={fieldErrors.description ? 'is-invalid' : ''}
                      />
                      {fieldErrors.description && (
                        <Form.Text className="text-danger">
                          {fieldErrors.description}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <div className="mt-4">
                  <Button 
                    type="submit" 
                    variant="primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Creating...
                      </>
                    ) : (
                      <>
                        Create Resource
                      </>
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="secondary"
                    onClick={() => navigate('/admin/resources')}
                  >
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
