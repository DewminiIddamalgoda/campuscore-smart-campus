import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card, Badge } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import bookingApi from '../../api/bookingApi';
import resourceApi from '../../api/resourceApi';
import { Link } from 'react-router-dom';

const STATUS_BADGE = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'danger',
  CANCELLED: 'secondary',
};

const STATUS_LABEL = {
  PENDING: '⏳ Pending',
  APPROVED: '✅ Approved',
  REJECTED: '❌ Rejected',
  CANCELLED: '⊘ Cancelled',
};

const UserProfile = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [resourcesById, setResourcesById] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        const data = await bookingApi.getUserBookings(user.email);
        setBookings(data || []);

        const resourceIds = Array.from(new Set((data || []).map((b) => b.resourceId).filter(Boolean)));
        const map = {};
        await Promise.all(resourceIds.map(async (id) => {
          try {
            const r = await resourceApi.getResourceById(id);
            map[id] = r;
          } catch (e) {
            // ignore
          }
        }));

        setResourcesById(map);
      } catch (e) {
        console.error('Failed to load bookings', e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user?.email]);

  return (
    <div className="profile-page" style={{ paddingTop: '140px', paddingBottom: '140px' }}>
      <Container>
        <Row>
          <Col md={8} className="mx-auto">
            <Card className="modern-card p-4 p-md-5">
              <h2 className="mb-1">Welcome {user?.fullName}</h2>
              <p className="text-muted mb-4">{user?.email}</p>

              <div className="d-flex align-items-center gap-2 mb-4">
                <Link to="/profile/edit" className="btn btn-primary" style={{ color: '#fff' }}>Edit Profile</Link>
              </div>

              <hr />

              <h4>Your Booking Requests</h4>

              {loading ? (
                <div>Loading bookings...</div>
              ) : bookings.length === 0 ? (
                <div>No bookings found.</div>
              ) : (
                bookings.map((b) => (
                  <Card key={b.id || b._id || Math.random()} className="mb-3">
                    <Card.Body>
                      <h5>{resourcesById[b.resourceId]?.name || resourcesById[b.resourceId]?.title || 'Resource'}</h5>
                      <p>
                        <strong>When:</strong> {b.date || b.bookingDate || b.from || ''} {b.time || b.fromTime || ''}
                      </p>
                      <p>
                        <strong>Status: </strong>
                        <Badge bg={STATUS_BADGE[b.status] || 'secondary'}>
                          {STATUS_LABEL[b.status] || b.status}
                        </Badge>
                      </p>
                      <p>
                        <strong>Details:</strong> {b.details || b.purpose || ''}
                      </p>
                    </Card.Body>
                  </Card>
                ))
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UserProfile;
