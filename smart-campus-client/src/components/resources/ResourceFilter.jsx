import React, { useState, useEffect } from 'react';
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
    { value: 'ACTIVE', label: 'Active' },
    { value: 'OUT_OF_SERVICE', label: 'Out of Service' },
    { value: 'UNDER_MAINTENANCE', label: 'Under Maintenance' }
  ];

  const filterResources = (resources) => {
    return resources.filter((resource) => {
      const matchesSearch =
        resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    if (onReset) onReset();
  };

  useEffect(() => {
    if (onFilter) {
      onFilter({
        searchTerm,
        filterType,
        filterStatus,
        filterFunction: filterResources
      });
    }
  }, [searchTerm, filterType, filterStatus]);

  return (
    <>
      <style>{`
        .resource-filter-card {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border: 1px solid rgba(59, 130, 246, 0.1);
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        }

        .resource-filter-card:hover {
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
        }

        .resource-filter-input-group {
          display: flex;
          align-items: stretch;
          width: 100%;
          overflow: hidden;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          background: #ffffff;
          min-height: 56px;
        }

        .resource-filter-input-group:focus-within {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .resource-filter-input-group .input-group-text {
          margin: 0;
          width: 56px;
          min-width: 56px;
          border: none;
          border-radius: 0;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          flex-shrink: 0;
        }

        .resource-filter-input-group .form-control {
          border: none !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          height: 56px;
          padding: 0 16px;
          background: #ffffff;
        }

        .resource-filter-input-group .form-control:focus {
          box-shadow: none !important;
          outline: none;
        }

        .resource-filter-input-group .form-control::placeholder {
          color: #64748b;
          opacity: 1;
        }

        .resource-filter-select,
        .resource-filter-btn {
          min-height: 56px;
        }

        .resource-filter-select {
          width: 100%;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 0.55rem 1rem;
          background: #ffffff;
          box-sizing: border-box;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .resource-filter-select:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          outline: none;
        }

        .resource-filter-btn {
          width: 100%;
          background: linear-gradient(135deg, #6b7280, #4b5563);
          border: none;
          border-radius: 12px;
          color: #ffffff;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .resource-filter-btn:hover {
          background: linear-gradient(135deg, #4b5563, #374151);
          transform: translateY(-1px);
          color: #ffffff;
        }

        .resource-filter-btn:active {
          transform: translateY(0);
        }
      `}</style>

      <Card className="mb-4 resource-filter-card">
        <Card.Body className="p-4">
          <Row className="g-3 align-items-end">
            <Col md={4}>
              <InputGroup className="resource-filter-input-group">
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
                className="resource-filter-select"
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
                className="resource-filter-select"
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
              <Button className="resource-filter-btn w-100" onClick={handleReset}>
                <FaFilter />
                Clear
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default ResourceFilter;