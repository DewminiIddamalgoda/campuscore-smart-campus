import React, { useState, useEffect } from 'react';
import { Row, Col, Alert, Spinner } from 'react-bootstrap';
import ResourceCard from '../../components/ResourceCard';
import ResourceFilter from '../../components/ResourceFilter';
import resourceApi from "../../api/resourceApi";

const ResourceListPage = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const data = await resourceApi.getAllResources();
      setResources(data);
      setFilteredResources(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch resources. Please try again later.');
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async (filters) => {
    try {
      setLoading(true);
      const hasFilters = Object.values(filters).some(value => value !== '');
      
      if (hasFilters) {
        const data = await resourceApi.searchResources(filters);
        setFilteredResources(data);
      } else {
        setFilteredResources(resources);
      }
      setError(null);
    } catch (err) {
      setError('Failed to search resources. Please try again later.');
      console.error('Error searching resources:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilteredResources(resources);
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

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Oops! Something went wrong</Alert.Heading>
        <p>{error}</p>
        <Button variant="outline-danger" onClick={fetchResources}>
          Try Again
        </Button>
      </Alert>
    );
  }

  return (
    <div>
      <h2 className="mb-4">🏫 Campus Resources</h2>
      
      <ResourceFilter onFilter={handleFilter} onReset={handleReset} />
      
      {filteredResources.length === 0 ? (
        <Alert variant="info">
          <Alert.Heading>No resources found</Alert.Heading>
          <p>Try adjusting your search filters or check back later for available resources.</p>
        </Alert>
      ) : (
        <>
          <div className="mb-3">
            <h5>Found {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''}</h5>
          </div>
          
          <Row xs={1} md={2} lg={3} xl={4} className="g-4">
            {filteredResources.map((resource) => (
              <Col key={resource.id}>
                <ResourceCard resource={resource} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </div>
  );
};

export default ResourceListPage;
