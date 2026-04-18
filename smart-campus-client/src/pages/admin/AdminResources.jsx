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
  FaEye
} from 'react-icons/fa';
import resourceApi from '../../api/resourceApi';

const styles = `
  .admin-resources {
    background: #f8fafc;
    min-height: 100vh;
  }

  .admin-resources .page-header {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    padding: 2rem 1.5rem;
    margin-bottom: 1.75rem;
    border-radius: 20px;
    box-shadow: 0 16px 40px rgba(15, 23, 42, 0.14);
  }

  .admin-resources .page-header .resource-title {
    color: #ffffff !important;
    font-weight: 700;
    margin: 0 !important;
    font-size: 2rem;
  }

  .admin-resources .resource-subtitle {
    color: rgba(255, 255, 255, 0.85);
    margin-top: 0.75rem;
    max-width: 680px;
    line-height: 1.6;
  }

  .admin-resources .summary-card {
    border-radius: 20px;
    min-height: 130px;
    box-shadow: 0 16px 30px rgba(15, 23, 42, 0.08);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    overflow: hidden;
    border: none;
  }

  .admin-resources .summary-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 22px 40px rgba(15, 23, 42, 0.12);
  }

  .admin-resources .summary-card .summary-top {
    padding: 1rem 1.25rem;
    color: #fff;
    background: linear-gradient(135deg, #0f766e 0%, #06b6d4 100%);
  }

  .admin-resources .summary-card .summary-body {
    padding: 1rem 1.25rem;
    background: #fff;
  }

  .admin-resources .summary-value {
    font-size: 2rem;
    font-weight: 700;
    color: #0f172a;
  }

  .admin-resources .summary-label {
    font-size: 0.95rem;
    color: #475569;
  }

  .admin-resources .filter-card {
    border-radius: 20px;
    box-shadow: 0 16px 30px rgba(15, 23, 42, 0.08);
    border: none;
  }

  .admin-resources .filter-card .form-select {
    border-radius: 14px;
    min-height: 54px;
    border: 1px solid #e2e8f0;
    transition: border-color 0.25s ease, box-shadow 0.25s ease;
  }

  .admin-resources .filter-card .form-select:focus {
    border-color: #06b6d4;
    box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.14);
  }

  .admin-resources .filter-card .search-input-group {
    display: flex;
    align-items: stretch;
    overflow: hidden;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    background: #ffffff;
    min-height: 54px;
  }

  .admin-resources .filter-card .search-input-group:focus-within {
    border-color: #06b6d4;
    box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.14);
  }

  .admin-resources .filter-card .search-input-group .input-group-text {
    background: linear-gradient(135deg, #0f766e, #06b6d4);
    color: #ffffff;
    border: none;
    border-radius: 0;
    min-width: 56px;
    width: 56px;
    justify-content: center;
    align-items: center;
    display: inline-flex;
    padding: 0;
    flex-shrink: 0;
    box-shadow: none;
  }

  .admin-resources .filter-card .search-input {
    border: none !important;
    border-radius: 0 !important;
    min-height: 54px;
    background: #ffffff;
    box-shadow: none !important;
    padding: 0 16px;
    transition: none;
  }

  .admin-resources .filter-card .search-input:focus {
    border: none !important;
    box-shadow: none !important;
    outline: none;
    transform: none;
  }

  .admin-resources .filter-card .search-input::placeholder {
    color: #94a3b8;
  }

  .admin-resources .filter-card .btn {
    min-height: 54px;
    border-radius: 14px;
  }

  .admin-resources .table-responsive {
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid rgba(226, 232, 240, 0.9);
  }

  .admin-resources table {
    margin-bottom: 0;
    background: #ffffff;
  }

  .admin-resources table thead {
    background: rgba(15, 23, 42, 0.04);
  }

  .admin-resources table thead th {
    color: #0f172a !important;
    font-weight: 700;
    border-bottom: none;
  }

  .admin-resources table tbody tr:hover {
    background: rgba(6, 182, 212, 0.08);
  }

  .admin-resources .action-dropdown .dropdown-toggle {
    border-radius: 14px;
    min-height: 38px;
  }

  .admin-resources .tip-card {
    border-radius: 20px;
    border: none;
    background: linear-gradient(135deg, rgba(6, 182, 212, 0.08), rgba(59, 130, 246, 0.08));
    box-shadow: 0 16px 30px rgba(15, 23, 42, 0.06);
  }

  .admin-resources .tip-card h5 {
    font-weight: 700;
  }

  .admin-resources .tip-card p {
    color: #475569;
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
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);

    return () => {
      styleElement.remove();
    };
  }, []);

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
        name: resource.name || '',
        type: resource.type || 'LECTURE_HALL',
        capacity: resource.capacity || '',
        location: resource.location || '',
        status: resource.status || 'ACTIVE',
        availableFrom: resource.availableFrom || '',
        availableTo: resource.availableTo || '',
        description: resource.description || ''
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
        const updatedResource = await resourceApi.updateResource(editingResource.id, formData);
        setResources(resources.map((r) =>
          r.id === editingResource.id ? updatedResource : r
        ));
        showSuccessAlert('Resource updated successfully!');
      } else {
        const newResource = await resourceApi.createResource(formData);
        setResources([...resources, newResource]);
        showSuccessAlert('Resource added successfully!');
      }

      handleCloseModal();
    } catch (err) {
      showErrorAlert(
        editingResource
          ? 'Failed to update resource. Please try again.'
          : 'Failed to add resource. Please try again.'
      );
      console.error('Error saving resource:', err);
    }
  };

  const handleDelete = async (id) => {
    if (globalThis.confirm('Are you sure you want to delete this resource?')) {
      try {
        await resourceApi.deleteResource(id);
        setResources(resources.filter((r) => r.id !== id));
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

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'all' || resource.type === filterType;
    const matchesStatus = filterStatus === 'all' || resource.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const totalResources = resources.length;
  const activeResources = resources.filter((resource) => resource.status === 'ACTIVE').length;
  const maintenanceResources = resources.filter((resource) => resource.status === 'UNDER_MAINTENANCE').length;
  const outOfServiceResources = resources.filter((resource) => resource.status === 'OUT_OF_SERVICE').length;

  const getStatusBadge = (status) => {
    const statusOption = statusOptions.find((s) => s.value === status);
    return (
      <Badge bg={statusOption?.variant || 'secondary'}>
        {statusOption?.label || status}
      </Badge>
    );
  };

  const getTypeLabel = (type) => {
    const typeOption = resourceTypes.find((t) => t.value === type);
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
          <div className="d-flex justify-content-between align-items-start flex-column flex-md-row gap-3">
            <div>
              <h2 className="mb-0 resource-title">Resource Management</h2>
              <p className="resource-subtitle">
                Keep campus spaces and equipment organized with real-time availability, capacity details, and quick edit actions.
              </p>
            </div>
            <Button variant="primary" onClick={() => navigate('/admin/resources/add')}>
              <FaPlus className="me-2" />
              Add Resource
            </Button>
          </div>
        </div>

        <Row className="g-3 mb-4">
          <Col md={3}>
            <Card className="summary-card">
              <div className="summary-top">Total Resources</div>
              <div className="summary-body">
                <div className="summary-value">{totalResources}</div>
                <div className="summary-label">All registered campus spaces and equipment</div>
              </div>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="summary-card">
              <div className="summary-top">Active</div>
              <div className="summary-body">
                <div className="summary-value">{activeResources}</div>
                <div className="summary-label">Ready for booking</div>
              </div>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="summary-card">
              <div className="summary-top">Maintenance</div>
              <div className="summary-body">
                <div className="summary-value">{maintenanceResources}</div>
                <div className="summary-label">Needs attention or repair</div>
              </div>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="summary-card">
              <div className="summary-top">Out of Service</div>
              <div className="summary-body">
                <div className="summary-value">{outOfServiceResources}</div>
                <div className="summary-label">Temporarily unavailable</div>
              </div>
            </Card>
          </Col>
        </Row>

        <Row className="g-4 mb-4">
          <Col lg={8}>
            <Card className="filter-card shadow-sm border-0">
              <Card.Body>
                <Row className="g-3 align-items-center">
                  <Col md={4}>
                    <InputGroup className="search-input-group shadow-sm">
                      <InputGroup.Text>
                        <FaSearch />
                      </InputGroup.Text>
                      <FormControl
                        className="search-input"
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
                      {resourceTypes.map((type) => (
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
                      {statusOptions.map((status) => (
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
          </Col>

          <Col lg={4}>
            <Card className="tip-card p-3">
              <Card.Body>
                <h5>Quick Tips</h5>
                <p className="mb-0">
                  Use the search bar to find resources instantly, and keep the availability times updated so users can book without delays.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

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
                  {filteredResources.map((resource) => (
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
                        <Dropdown className="action-dropdown">
                          <Dropdown.Toggle variant="outline-primary" size="sm">
                            Actions
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleShowModal(resource)}>
                              <FaEdit className="me-2" />
                              Edit
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleDelete(resource.id)}>
                              <FaTrash className="me-2" />
                              Delete
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => navigate(`/admin/resources/${resource.id}`)}
                            >
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
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Type *</Form.Label>
                    <Form.Select
                      required
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                    >
                      {resourceTypes.map((type) => (
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
                      onChange={(e) =>
                        setFormData({ ...formData, capacity: e.target.value })
                      }
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
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
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
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                    >
                      {statusOptions.map((status) => (
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
                      onChange={(e) =>
                        setFormData({ ...formData, availableFrom: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Available To</Form.Label>
                    <Form.Control
                      type="time"
                      value={formData.availableTo}
                      onChange={(e) =>
                        setFormData({ ...formData, availableTo: e.target.value })
                      }
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
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
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