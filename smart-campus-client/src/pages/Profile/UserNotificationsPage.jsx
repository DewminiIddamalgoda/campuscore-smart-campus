import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, InputGroup } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import notificationApi from '../../api/notificationApi';
import { FaBell, FaTrash, FaSearch } from 'react-icons/fa';
import './ProfileStyles.css';

const TYPE_BADGE = {
  BOOKING_APPROVED: 'success',
  BOOKING_REJECTED: 'danger',
  TICKET_STATUS: 'info',
  TICKET_COMMENT: 'secondary',
  RESOURCE_AVAILABLE: 'primary',
};

const TYPE_LABEL = {
  BOOKING_APPROVED: 'Booking Approved',
  BOOKING_REJECTED: 'Booking Rejected',
  TICKET_STATUS: 'Ticket Update',
  TICKET_COMMENT: 'New Comment',
  RESOURCE_AVAILABLE: 'Resource Available',
};

function formatTimestamp(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleString();
}

const UserNotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const token = localStorage.getItem('campuscore_auth_token');

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      try {
        const data = await notificationApi.getMyNotifications(token);
        setNotifications(data || []);
        await notificationApi.markAllRead(token);
      } catch (e) {
        console.error('Failed to load notifications', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDelete = async (id) => {
    try {
      await notificationApi.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (e) {
      console.error('Failed to delete notification', e);
    }
  };

  const filtered = notifications.filter((n) => {
    const matchSearch = !search ||
      (n.resourceName && n.resourceName.toLowerCase().includes(search.toLowerCase())) ||
      (n.message && n.message.toLowerCase().includes(search.toLowerCase()));
    const matchDate = !dateFilter || (n.createdAt && n.createdAt.startsWith(dateFilter));
    return matchSearch && matchDate;
  });

  return (
    <div className="notifications-page">
      <Container>
        <div className="profile-panel">
          <Row>
            <Col md={9} className="mx-auto">
              <div className="profile-header">
                <div>
                  <h2>My Notifications</h2>
                  <p className="profile-subtitle">Search, filter and manage all your alerts from one place.</p>
                </div>
              </div>

              <Card className="notifications-card p-4 mb-4">
                <Row className="notification-filter-row g-3">
                  <Col md={7}>
                    <InputGroup>
                      <InputGroup.Text><FaSearch /></InputGroup.Text>
                      <Form.Control
                        className="modern-input"
                        placeholder="Search by resource or message..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                  <Col md={5}>
                    <Form.Control
                      className="modern-input"
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                    />
                  </Col>
                </Row>
                <div className="filter-help mt-3">
                  <small className="text-muted">
                    💡 Use the search bar to find notifications by resource name or message content. Select a date to filter notifications from that day onwards.
                  </small>
                </div>
                <div className="notification-types mt-3">
                  <small className="text-muted">
                    <strong>Notification Types:</strong> Booking approvals/rejections, ticket updates, resource availability alerts, and new comments.
                  </small>
                </div>
              </Card>

            {loading ? (
              <p className="notification-empty">Loading notifications...</p>
            ) : filtered.length === 0 ? (
              <Card className="notification-card notification-empty">No notifications found.</Card>
            ) : (
              filtered.map((n) => (
                <Card key={n.id} className={`notification-card mb-3 ${n.read ? '' : 'unread'}`}>
                  <Card.Body>
                    <div className="notification-meta">
                      <Badge bg={TYPE_BADGE[n.type] || 'secondary'}>
                        {TYPE_LABEL[n.type] || n.type}
                      </Badge>
                      {n.resourceName && (
                        <span>{n.resourceName}</span>
                      )}
                      {!n.read && <Badge bg="primary" pill>New</Badge>}
                    </div>
                    <p className="mb-1" style={{ color: '#334155' }}>{n.message}</p>
                    <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
                      <small className="text-muted">{formatTimestamp(n.createdAt)}</small>
                      <Button
                        className="btn secondary-btn"
                        size="sm"
                        onClick={() => handleDelete(n.id)}
                      >
                        <FaTrash />
                        Delete
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))
            )}
          </Col>
        </Row>
        </div>
      </Container>
    </div>
  );
};

export default UserNotificationsPage;
