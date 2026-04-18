import React, { useEffect, useState } from 'react';
import { Container, Card, Badge, Button, Form, Row, Col, InputGroup, Table } from 'react-bootstrap';
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

const AdminNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await notificationApi.getAllNotifications();
        setNotifications(data || []);
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
    <div
      className="admin-notifications-page"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)'
      }}
    >
      <Container fluid className="py-4 px-3 px-md-4">
        <Card
          className="border-0 shadow-sm mb-4"
          style={{
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#fff'
          }}
        >
          <Card.Body className="p-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <Badge bg="light" text="dark" className="px-3 py-2 rounded-pill">
                    Admin Panel
                  </Badge>
                  <Badge bg="success" className="px-3 py-2 rounded-pill">
                    Live Data
                  </Badge>
                </div>
                <h2 className="fw-bold mb-2 text-white">All Notifications</h2>
                <p className="mb-0 text-light opacity-75">
                  Search notifications, review alerts, and manage system messages.
                </p>
              </div>
              <div className="text-md-end">
                <div className="small opacity-75">Connected to notification events</div>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card className="border-0 shadow-sm p-3 mb-4">
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
      </Container>

      {loading ? (
        <p>Loading notifications...</p>
      ) : filtered.length === 0 ? (
        <Card className="p-4 text-center text-muted">No notifications found.</Card>
      ) : (
        <Card>
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Type</th>
                  <th>Message</th>
                  <th>Resource</th>
                  <th>Recipient</th>
                  <th>Time</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((n) => (
                  <tr key={n.id}>
                    <td>
                      <Badge bg={TYPE_BADGE[n.type] || 'secondary'}>
                        {TYPE_LABEL[n.type] || n.type}
                      </Badge>
                    </td>
                    <td>{n.message}</td>
                    <td>{n.resourceName || '—'}</td>
                    <td>{n.recipientEmail || <span className="text-muted">System</span>}</td>
                    <td><small>{formatTimestamp(n.createdAt)}</small></td>
                    <td>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(n.id)}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      )}

      <style>{`
        .admin-notifications-page .card {
          border-radius: 1.25rem;
          border: 0;
        }

        .admin-notifications-page .table-responsive {
          background: #ffffff;
          border-radius: 1.25rem;
          border: 1px solid rgba(226, 232, 240, 0.9);
        }

        .admin-notifications-page table thead th {
          background: #f8fafc;
          color: #475569;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
};

export default AdminNotificationsPage;
