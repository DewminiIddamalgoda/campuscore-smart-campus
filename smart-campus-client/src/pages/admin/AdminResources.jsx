import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Modal,
  Form,
  Badge,
  InputGroup,
  FormControl,
  Dropdown,
  Alert,
  Spinner
} from 'react-bootstrap';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaFilter,
  FaEye,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import resourceApi from '../../api/resourceApi';

const styles = `
  .admin-resources .page-header {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    color: white;
    padding: 2rem 0;
    margin-bottom: 2rem;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }

  .admin-resources .page-header h2 {
    font-weight: 700;
    margin: 0;
    font-size: 2rem;
  }
`;

const AdminResources = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');

  // Inject custom styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

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

  const resourceTypes = [
    { value: 'LECTURE_HALL', label: 'Lecture Hall' },
    { value: 'LAB', label: 'Lab' },
    { value: 'MEETING_ROOM', label: 'Meeting Room' },
    { value: 'EQUIPMENT', label: 'Equipment' }
  ];

  const statusOptions = [
    { value: 'ACTIVE', label: 'Active', variant: 'success' },
    { value: 'OUT_OF_SERVICE', label: 'Out of Service', variant: 'danger' },
    { value: 'UNDER_MAINTENANCE', label: 'Under Maintenance', variant: 'warning' }
  ];

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await resourceApi.getAllResources();
      setResources(data);
    } catch (err) {
      setError('Failed to fetch resources. Please try again.');
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (resource = null) => {
    if (resource) {
      setEditingResource(resource);
      setFormData({
        name: resource.name,
        type: resource.type,
        capacity: resource.capacity,
        location: resource.location,
        status: resource.status,
        availableFrom: resource.availableFrom,
        availableTo: resource.availableTo,
        description: resource.description
      });
    } else {
      setEditingResource(null);
      setFormData({
        name: '',
        type: 'LECTURE_HALL',
        capacity: '',
        location: '',
        status: 'ACTIVE',
        availableFrom: '',
        availableTo: '',
        description: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingResource(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingResource) {
        // Update existing resource
        const updatedResource = await resourceApi.updateResource(editingResource.id, formData);
        setResources(resources.map(r => 
          r.id === editingResource.id 
            ? updatedResource
            : r
        ));
        showSuccessAlert('Resource updated successfully!');
      } else {
        // Add new resource
        const newResource = await resourceApi.createResource(formData);
        setResources([...resources, newResource]);
        showSuccessAlert('Resource added successfully!');
      }
      
      handleCloseModal();
    } catch (err) {
      showErrorAlert(editingResource ? 'Failed to update resource. Please try again.' : 'Failed to add resource. Please try again.');
      console.error('Error saving resource:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await resourceApi.deleteResource(id);
        setResources(resources.filter(r => r.id !== id));
        showSuccessAlert('Resource deleted successfully!');
      } catch (err) {
        showErrorAlert('Failed to delete resource. Please try again.');
        console.error('Error deleting resource:', err);
      }
    }
  };

  const showSuccessAlert = (message) => {
    setAlertMessage(message);
    setAlertVariant('success');
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const showErrorAlert = (message) => {
    setAlertMessage(message);
    setAlertVariant('danger');
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || resource.type === filterType;
    const matchesStatus = filterStatus === 'all' || resource.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusOption = statusOptions.find(s => s.value === status);
    return (
      <Badge bg={statusOption?.variant || 'secondary'}>
        {statusOption?.label || status}
      </Badge>
    );
  };

  const getTypeLabel = (type) => {
    const typeOption = resourceTypes.find(t => t.value === type);
    return typeOption?.label || type;
  };

  if (loading) {
    return (
      <div className="admin-resources p-4">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading resources...</span>
          </Spinner>
          <p className="mt-3">Loading resources from database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-resources p-4">
        <Alert variant="danger">
          <Alert.Heading>Error Loading Resources</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={fetchResources}>
            Try Again
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="admin-resources">
      <Container fluid className="py-4">
        {showAlert && (
          <Alert 
            variant={alertVariant} 
            className="position-fixed top-0 start-50 translate-middle-x mt-3" 
            style={{ zIndex: 1050, minWidth: '300px' }}
            onClose={() => setShowAlert(false)}
            dismissible
          >
            {alertMessage}
          </Alert>
        )}

        <div className="page-header p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0">Resource Management</h2>
            <Button variant="primary" onClick={() => navigate('/admin/resources/add')}>
              <FaPlus className="me-2" />
              Add Resource
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-4 shadow-sm border-0">
          <Card.Body>
            <Row>
              <Col md={4}>
                <InputGroup>
                  <InputGroup.Text>
                    <FaSearch />
                  </InputGroup.Text>
                  <FormControl
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={3}>
                <Form.Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  {resourceTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  {statusOptions.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={2}>
                <Button 
                  variant="outline-secondary" 
                  className="w-100"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterType('all');
                    setFilterStatus('all');
                  }}
                >
                  <FaFilter className="me-2" />
                  Clear
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Resources Table */}
        <Card className="shadow-sm border-0">
          <Card.Body>
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Capacity</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Availability</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResources.map(resource => (
                    <tr key={resource.id}>
                      <td>
                        <div>
                          <strong>{resource.name}</strong>
                          <br />
                          <small className="text-muted">{resource.description}</small>
                        </div>
                      </td>
                      <td>{getTypeLabel(resource.type)}</td>
                      <td>{resource.capacity}</td>
                      <td>{resource.location}</td>
                      <td>{getStatusBadge(resource.status)}</td>
                      <td>
                        <small>
                          {resource.availableFrom} - {resource.availableTo}
                        </small>
                      </td>
                      <td>
                        <Dropdown>
                          <Dropdown.Toggle variant="outline-primary" size="sm">
                            Actions
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleShowModal(resource)}>
                              <FaEdit className="me-2" />
                              Edit
                            </Dropdown.Item>
                            <Dropdown.Item 
                              variant="danger" 
                              onClick={() => handleDelete(resource.id)}
                            >
                              <FaTrash className="me-2" />
                              Delete
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => navigate(`/admin/resources/${resource.id}`)}>
                              <FaEye className="me-2" />
                              View Details
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              
              {filteredResources.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-muted mb-0">No resources found</p>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>

        {/* Add/Edit Modal */}
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {editingResource ? 'Edit Resource' : 'Add New Resource'}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Resource Name *</Form.Label>
                    <Form.Control
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Type *</Form.Label>
                    <Form.Select
                      required
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                      {resourceTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Capacity *</Form.Label>
                    <Form.Control
                      type="number"
                      required
                      min="1"
                      value={formData.capacity}
                      onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Location *</Form.Label>
                    <Form.Control
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                    >
                      {statusOptions.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Available From</Form.Label>
                    <Form.Control
                      type="time"
                      value={formData.availableFrom}
                      onChange={(e) => setFormData({...formData, availableFrom: e.target.value})}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Available To</Form.Label>
                    <Form.Control
                      type="time"
                      value={formData.availableTo}
                      onChange={(e) => setFormData({...formData, availableTo: e.target.value})}
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter resource description..."
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editingResource ? 'Update Resource' : 'Add Resource'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </div>
  );
};

export default AdminResources;
