import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Form,
  InputGroup,
  FormControl
} from 'react-bootstrap';
import { 
  FaSearch, 
  FaFilter
} from 'react-icons/fa';

const ResourceFilter = ({ onFilter, onReset }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

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

  // Filter function that returns filtered resources
  const filterResources = (resources) => {
    return resources.filter(resource => {
      const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           resource.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || resource.type === filterType;
      const matchesStatus = filterStatus === 'all' || resource.status === filterStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  };

  const handleReset = () => {
    setSearchTerm('');
    setFilterType('all');
    setFilterStatus('all');
    if (onReset) {
      onReset();
    }
  };

  // Expose filter function and current filter values to parent
  React.useImperativeHandle(React.createRef(), () => ({
    filterResources,
    getFilters: () => ({ searchTerm, filterType, filterStatus })
  }));

  // Also provide callback-based filtering for compatibility
  if (onFilter) {
    React.useEffect(() => {
      const filters = {
        searchTerm,
        filterType,
        filterStatus,
        filterFunction: filterResources
      };
      onFilter(filters);
    }, [searchTerm, filterType, filterStatus]);
  }

  return (
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
              onClick={handleReset}
            >
              <FaFilter className="me-2" />
              Clear
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ResourceFilter;
