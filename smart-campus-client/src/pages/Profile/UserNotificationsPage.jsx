import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, InputGroup } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import notificationApi from '../../api/notificationApi';
import { FaBell, FaTrash, FaSearch } from 'react-icons/fa';

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
    <div style={{ paddingTop: '140px', paddingBottom: '140px' }}>
      <Container>
        <Row>
          <Col md={9} className="mx-auto">
            <div className="d-flex align-items-center gap-2 mb-4">
              <FaBell size={24} />
              <h2 className="mb-0">My Notifications</h2>
            </div>

            <Card className="p-3 mb-4">
              <Row className="g-2">
                <Col md={7}>
                  <InputGroup>
                    <InputGroup.Text><FaSearch /></InputGroup.Text>
                    <Form.Control
                      placeholder="Search by resource or message..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </InputGroup>
                </Col>
                <Col md={5}>
                  <Form.Control
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  />
                </Col>
              </Row>
            </Card>

            {loading ? (
              <p>Loading notifications...</p>
            ) : filtered.length === 0 ? (
              <Card className="p-4 text-center text-muted">No notifications found.</Card>
            ) : (
              filtered.map((n) => (
                <Card key={n.id} className={`mb-3 ${n.read ? '' : 'border-primary'}`}>
                  <Card.Body className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <Badge bg={TYPE_BADGE[n.type] || 'secondary'}>
                          {TYPE_LABEL[n.type] || n.type}
                        </Badge>
                        {n.resourceName && (
                          <span className="text-muted small">{n.resourceName}</span>
                        )}
                        {!n.read && <Badge bg="primary" pill>New</Badge>}
                      </div>
                      <p className="mb-1">{n.message}</p>
                      <small className="text-muted">{formatTimestamp(n.createdAt)}</small>
                    </div>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="ms-2"
                      onClick={() => handleDelete(n.id)}
                    >
                      <FaTrash />
                    </Button>
                  </Card.Body>
                </Card>
              ))
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UserNotificationsPage;
