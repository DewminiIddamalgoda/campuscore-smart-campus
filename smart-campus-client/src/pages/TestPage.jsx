import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';

const TestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  console.log('TestPage rendered with ID:', id);

  return (
    <div>
      <h2>Test Page</h2>
      <Card>
        <Card.Body>
          <p>This is a test page to verify routing works!</p>
          <p>ID parameter: {id || 'None'}</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
          <Button onClick={() => navigate('/resources/add')} className="ms-2">
            Go to Add Resource
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default TestPage;
