import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import bookingApi from '../../api/bookingApi';
import resourceApi from '../../api/resourceApi';
import notificationApi from '../../api/notificationApi';
import { Link } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import './ProfileStyles.css';
import { getMyTickets } from '../../api/ticketService';

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
  const [unreadCount, setUnreadCount] = useState(0);
  const [tickets, setTickets] = useState([]);

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
            console.warn('Failed to load resource details for', id, e);
          }
        }));

        setResourcesById(map);
      } catch (e) {
        console.error('Failed to load bookings', e);
      } finally {
        setLoading(false);
      }

      try {
        const token = localStorage.getItem('campuscore_auth_token');
        if (token) {
          const count = await notificationApi.getUnreadCount(token);
          setUnreadCount(count || 0);
        }
      } catch (e) {
        console.warn('Failed to load unread notification count', e);
      }

      try {
        const res = await getMyTickets();
        setTickets(res.data || []);
      } catch (e) {
        console.warn('Failed to load tickets', e);
      }
    };

    load();
  }, [user?.email]);

  let bookingContent;

  if (loading) {
    bookingContent = <div className="notification-empty">Loading bookings...</div>;
  } else if (bookings.length === 0) {
    bookingContent = <div className="notification-empty">No bookings found.</div>;
  } else {
    bookingContent = bookings.map((b) => (
      <Card key={b.id || b._id || Math.random()} className="booking-card mb-3">
        <Card.Body>
          <h5>{resourcesById[b.resourceId]?.name || resourcesById[b.resourceId]?.title || 'Resource'}</h5>
          <p className="mb-1">
            <strong>When:</strong> {b.date || b.bookingDate || b.from || ''} {b.time || b.fromTime || ''}
          </p>
          <p className="mb-1">
            <strong>Status:</strong>{' '}
            <Badge bg={STATUS_BADGE[b.status] || 'secondary'}>
              {STATUS_LABEL[b.status] || b.status}
            </Badge>
          </p>
          <p className="mb-0">
            <strong>Details:</strong> {b.details || b.purpose || ''}
          </p>
        </Card.Body>
      </Card>
    ));
  }

  return (
    <div className="profile-page">
      <Container fluid>
        {/* Header Section */}
        <div className="section-header mb-5">
          <span className="section-label">Profile</span>
          <h1 className="section-title">
            Welcome {user?.fullName}
          </h1>
          <p className="section-description">
            Your Profile for bookings, notifications, tickets, and profile updates in one sleek workspace.
          </p>
        </div>

        <div className="profile-panel">
          <Row>
            <Col xs={12} lg={10} className="mx-auto">
              <div className="profile-card mb-4">
                <div className="welcome-stats mb-4">
                  <div className="stat-item">
                    <span className="stat-number">{bookings.length}</span>
                    <span className="stat-label">Total Bookings</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{unreadCount}</span>
                    <span className="stat-label">Unread Notifications</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{tickets.length}</span>
                    <span className="stat-label">My Tickets</span>
                  </div>
                </div>

                <div className="profile-actions mb-4">
                  <Link to="/profile/edit" className="btn modern-btn action-btn">
                    Edit Profile
                  </Link>
                  <Link to="/profile/notifications" className="btn secondary-btn action-btn position-relative">
                    <FaBell />
                    Notifications
                    {unreadCount > 0 && (
                      <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle">
                        {unreadCount}
                      </Badge>
                    )}
                  </Link>
                  <Link to="/profile/tickets" className="btn secondary-btn action-btn">
                    🎫 My Tickets
                  </Link>
                </div>

                <div className="quick-tips mb-4">
                  <h5>Quick Tips</h5>
                  <ul className="tips-list">
                    <li>📅 Book resources in advance to ensure availability</li>
                    <li>🔔 Check notifications regularly for booking updates</li>
                    <li>✏️ Keep your profile updated for better communication</li>
                    <li>📞 Contact support if you need help with bookings</li>
                  </ul>
                </div>

                <div className="form-section-divider" />

                <h4>Your Booking Requests</h4>

                {bookingContent}
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default UserProfile;
