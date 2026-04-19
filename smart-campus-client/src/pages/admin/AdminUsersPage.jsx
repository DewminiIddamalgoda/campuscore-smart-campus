import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  InputGroup,
  FormControl,
  Spinner,
  Alert,
  Modal,
  Button,
  Table,
} from 'react-bootstrap';
import { FaSearch, FaUser, FaEnvelope, FaPhone, FaUniversity, FaHistory } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import userApi from '../../api/userApi';
import bookingApi from '../../api/bookingApi';

const styles = `
  .admin-users {
    background: linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
    min-height: 100vh;
  }

  .admin-users .page-header {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    padding: 2rem 1.5rem;
    margin-bottom: 1.75rem;
    border-radius: 20px;
    box-shadow: 0 16px 40px rgba(15, 23, 42, 0.14);
  }

  .admin-users .page-header .user-title {
    color: #ffffff !important;
    font-weight: 700;
    margin: 0 !important;
    font-size: 2rem;
  }

  .admin-users .user-subtitle {
    color: rgba(255, 255, 255, 0.85);
    margin-top: 0.75rem;
    max-width: 680px;
    line-height: 1.6;
  }

  .admin-users .summary-card {
    border-radius: 20px;
    min-height: 130px;
    box-shadow: 0 16px 30px rgba(15, 23, 42, 0.08);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    overflow: hidden;
    border: none;
  }

  .admin-users .summary-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 22px 40px rgba(15, 23, 42, 0.12);
  }

  .admin-users .summary-card .summary-top {
    padding: 1rem 1.25rem;
    color: #fff;
    background: linear-gradient(135deg, #0f766e 0%, #06b6d4 100%);
  }

  .admin-users .summary-card .summary-body {
    padding: 1rem 1.25rem;
    background: #fff;
  }

  .admin-users .summary-value {
    font-size: 2rem;
    font-weight: 700;
    color: #0f172a;
  }

  .admin-users .summary-label {
    font-size: 0.95rem;
    color: #475569;
  }

  .admin-users .filter-card {
    border-radius: 20px;
    box-shadow: 0 16px 30px rgba(15, 23, 42, 0.08);
    border: none;
  }

  .admin-users .filter-card .search-input-group {
    display: flex;
    align-items: stretch;
    overflow: hidden;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    background: #ffffff;
    min-height: 54px;
  }

  .admin-users .filter-card .search-input-group:focus-within {
    border-color: #06b6d4;
    box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.14);
  }

  .admin-users .filter-card .search-input-group .input-group-text {
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

  .admin-users .filter-card .search-input {
    border: none !important;
    border-radius: 0 !important;
    min-height: 54px;
    background: #ffffff;
    box-shadow: none !important;
    padding: 0 16px;
    transition: none;
  }

  .admin-users .filter-card .search-input:focus {
    border: none !important;
    box-shadow: none !important;
    outline: none;
    transform: none;
  }

  .admin-users .filter-card .search-input::placeholder {
    color: #94a3b8;
  }

  .admin-users .table-responsive {
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid rgba(226, 232, 240, 0.9);
  }

  .admin-users table {
    margin-bottom: 0;
    background: #ffffff;
  }

  .admin-users table thead th {
    color: #ffffff !important;
    font-weight: 700;
    border-bottom: none;
  }

  .admin-users table tbody tr {
    cursor: pointer;
  }

  .admin-users table tbody tr:hover {
    background: rgba(6, 182, 212, 0.08);
  }

  .admin-users .role-badge-ADMIN {
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    color: #fff;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    display: inline-block;
  }

  .admin-users .role-badge-TECHNICIAN {
    background: linear-gradient(135deg, #0369a1, #0ea5e9);
    color: #fff;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    display: inline-block;
  }

  .admin-users .role-badge-STUDENT {
    background: linear-gradient(135deg, #059669, #10b981);
    color: #fff;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    display: inline-block;
  }

  .admin-users .detail-label {
    font-size: 0.8rem;
    color: #64748b;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 2px;
  }

  .admin-users .detail-value {
    font-size: 0.95rem;
    color: #0f172a;
    font-weight: 500;
  }

  .admin-users .detail-row {
    display: flex;
    gap: 8px;
    align-items: flex-start;
    margin-bottom: 1rem;
  }

  .admin-users .detail-icon {
    color: #06b6d4;
    margin-top: 3px;
    flex-shrink: 0;
  }

  .admin-users .booking-history-table th {
    background: linear-gradient(135deg, #0f172a, #1e293b) !important;
    color: #fff !important;
    font-weight: 600;
    font-size: 0.82rem;
  }

  .admin-users .booking-status-APPROVED,
  .admin-users .booking-status-CONFIRMED {
    background: #dcfce7;
    color: #166534;
    padding: 2px 10px;
    border-radius: 20px;
    font-size: 0.78rem;
    font-weight: 600;
    display: inline-block;
  }

  .admin-users .booking-status-PENDING {
    background: #fef9c3;
    color: #854d0e;
    padding: 2px 10px;
    border-radius: 20px;
    font-size: 0.78rem;
    font-weight: 600;
    display: inline-block;
  }

  .admin-users .booking-status-REJECTED {
    background: #fee2e2;
    color: #991b1b;
    padding: 2px 10px;
    border-radius: 20px;
    font-size: 0.78rem;
    font-weight: 600;
    display: inline-block;
  }

  .admin-users .booking-status-CHECKED_IN {
    background: #dbeafe;
    color: #1e40af;
    padding: 2px 10px;
    border-radius: 20px;
    font-size: 0.78rem;
    font-weight: 600;
    display: inline-block;
  }

  .admin-users .booking-status-CANCELLED {
    background: #f1f5f9;
    color: #475569;
    padding: 2px 10px;
    border-radius: 20px;
    font-size: 0.78rem;
    font-weight: 600;
    display: inline-block;
  }
`;

const roleLabel = (role) => {
  if (role === 'ADMIN') return 'Admin';
  if (role === 'TECHNICIAN') return 'Technician';
  if (role === 'STUDENT') return 'Student';
  return role || '—';
};

const AdminUsersPage = () => {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedUser, setSelectedUser] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const [showAccessDenied, setShowAccessDenied] = useState(false);

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
    return () => { styleElement.remove(); };
  }, []);

  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      setShowAccessDenied(true);
      setLoading(false);
      return;
    }
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userApi.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = async (u) => {
    setSelectedUser(u);
    setShowDetail(true);
    setUserBookings([]);
    setBookingsLoading(true);
    try {
      const bookings = await bookingApi.getUserBookings(u.email);
      setUserBookings(bookings || []);
    } catch {
      setUserBookings([]);
    } finally {
      setBookingsLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    const facultyStr = u.faculty
      ? (typeof u.faculty === 'object' ? (u.faculty.displayName || '') : u.faculty)
      : '';
    return (
      (u.fullName || '').toLowerCase().includes(term) ||
      (u.role || '').toLowerCase().includes(term) ||
      (u.email || '').toLowerCase().includes(term) ||
      facultyStr.toLowerCase().includes(term)
    );
  });

  const totalUsers = users.length;
  const totalAdmins = users.filter((u) => u.role === 'ADMIN').length;
  const totalTechnicians = users.filter((u) => u.role === 'TECHNICIAN').length;
  const totalStudents = users.filter((u) => u.role === 'STUDENT').length;

  if (showAccessDenied) {
    return (
      <div className="admin-users">
        <Modal show centered>
          <Modal.Header style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff', borderBottom: 'none', borderRadius: '16px 16px 0 0' }}>
            <Modal.Title>Access Restricted</Modal.Title>
          </Modal.Header>
          <Modal.Body className="py-4 px-4">
            <div className="text-center">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
              <h5 className="fw-bold mb-2">Only Admins Can Access This Dashboard</h5>
              <p className="text-muted mb-0">
                The User Management section is restricted to administrators only.
                Please contact an admin if you need access.
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer className="border-0 justify-content-center pb-4">
            <Button
              variant="dark"
              onClick={() => window.history.back()}
              style={{ borderRadius: '12px', padding: '10px 32px' }}
            >
              Go Back
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-users d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
        <div className="text-center text-muted">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading users...</span>
          </Spinner>
          <p className="mt-3">Loading users from database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-users p-4">
        <Alert variant="danger">
          <Alert.Heading>Error Loading Users</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={fetchUsers}>Try Again</Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="admin-users">
      <Container fluid className="py-4">

        {/* Page Header */}
        <div className="page-header p-4 mb-4">
          <div>
            <h2 className="mb-0 user-title">User Management</h2>
            <p className="user-subtitle">Manage and view all existing users</p>
          </div>
        </div>

        {/* Summary Cards */}
        <Row className="g-3 mb-4">
          <Col md={3}>
            <Card className="summary-card">
              <div className="summary-top">Total Users</div>
              <div className="summary-body">
                <div className="summary-value">{totalUsers}</div>
                <div className="summary-label">All registered users</div>
              </div>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="summary-card">
              <div className="summary-top">Admins</div>
              <div className="summary-body">
                <div className="summary-value">{totalAdmins}</div>
                <div className="summary-label">Admin accounts</div>
              </div>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="summary-card">
              <div className="summary-top">Technicians</div>
              <div className="summary-body">
                <div className="summary-value">{totalTechnicians}</div>
                <div className="summary-label">Technician accounts</div>
              </div>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="summary-card">
              <div className="summary-top">Students</div>
              <div className="summary-body">
                <div className="summary-value">{totalStudents}</div>
                <div className="summary-label">Student accounts</div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Search */}
        <Row className="mb-4">
          <Col lg={6}>
            <Card className="filter-card shadow-sm border-0">
              <Card.Body className="py-3">
                <InputGroup className="search-input-group shadow-sm">
                  <InputGroup.Text>
                    <FaSearch />
                  </InputGroup.Text>
                  <FormControl
                    className="search-input"
                    placeholder="Search by name, role, email, or faculty..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* User Table */}
        <div className="table-responsive">
          <Table hover>
            <thead style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)' }}>
              <tr>
                <th style={{ padding: '14px 20px' }}>#</th>
                <th style={{ padding: '14px 20px' }}>Full Name</th>
                <th style={{ padding: '14px 20px' }}>Email</th>
                <th style={{ padding: '14px 20px' }}>Role</th>
                <th style={{ padding: '14px 20px' }}>User ID</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-5">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, idx) => (
                  <tr key={u.userId || u.email} onClick={() => handleUserClick(u)}>
                    <td className="py-3 px-4 text-muted">{idx + 1}</td>
                    <td className="py-3 px-4 fw-semibold">{u.fullName || '—'}</td>
                    <td className="py-3 px-4 text-muted">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className={`role-badge-${u.role}`}>{roleLabel(u.role)}</span>
                    </td>
                    <td className="py-3 px-4 text-muted" style={{ fontFamily: 'monospace' }}>
                      {u.userId || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>

      </Container>

      {/* User Detail Modal */}
      <Modal show={showDetail} onHide={() => setShowDetail(false)} size="lg" centered>
        <Modal.Header
          closeButton
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#fff',
            borderBottom: 'none',
          }}
        >
          <Modal.Title style={{ fontWeight: 700 }}>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedUser && (
            <>
              <div className="mb-3">
                <span className={`role-badge-${selectedUser.role}`}>{roleLabel(selectedUser.role)}</span>
              </div>

              <Row className="g-3 mb-4">
                <Col md={6}>
                  <div className="detail-row">
                    <FaUser className="detail-icon" />
                    <div>
                      <div className="detail-label">Full Name</div>
                      <div className="detail-value">{selectedUser.fullName || '—'}</div>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="detail-row">
                    <FaEnvelope className="detail-icon" />
                    <div>
                      <div className="detail-label">Email</div>
                      <div className="detail-value">{selectedUser.email || '—'}</div>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="detail-row">
                    <FaPhone className="detail-icon" />
                    <div>
                      <div className="detail-label">Mobile Number</div>
                      <div className="detail-value">{selectedUser.contactNumber || '—'}</div>
                    </div>
                  </div>
                </Col>
                {selectedUser.role === 'STUDENT' && (
                  <Col md={6}>
                    <div className="detail-row">
                      <FaUniversity className="detail-icon" />
                      <div>
                        <div className="detail-label">Faculty</div>
                        <div className="detail-value">
                          {selectedUser.faculty
                            ? (typeof selectedUser.faculty === 'object'
                                ? (selectedUser.faculty.displayName || selectedUser.faculty.name || JSON.stringify(selectedUser.faculty))
                                : selectedUser.faculty)
                            : '—'}
                        </div>
                      </div>
                    </div>
                  </Col>
                )}
              </Row>

              {/* Booking History */}
              <div className="mt-2">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <FaHistory style={{ color: '#06b6d4' }} />
                  <h6 className="fw-bold mb-0">Booking History</h6>
                </div>
                {bookingsLoading ? (
                  <div className="text-center py-3 text-muted">
                    <Spinner animation="border" size="sm" className="me-2" />
                    Loading bookings...
                  </div>
                ) : userBookings.length === 0 ? (
                  <p className="text-muted small mb-0">No bookings found for this user.</p>
                ) : (
                  <div className="table-responsive">
                    <Table size="sm" className="booking-history-table">
                      <thead>
                        <tr>
                          <th className="py-2 px-3">Resource</th>
                          <th className="py-2 px-3">Date</th>
                          <th className="py-2 px-3">Time</th>
                          <th className="py-2 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userBookings.map((b) => (
                          <tr key={b.id || b.bookingId}>
                            <td className="py-2 px-3">{b.resourceName || b.resourceId || '—'}</td>
                            <td className="py-2 px-3">{b.bookingDate || '—'}</td>
                            <td className="py-2 px-3">
                              {b.startTime && b.endTime ? `${b.startTime} – ${b.endTime}` : '—'}
                            </td>
                            <td className="py-2 px-3">
                              <span className={`booking-status-${b.status || 'PENDING'}`}>
                                {b.status || 'PENDING'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button
            variant="dark"
            onClick={() => setShowDetail(false)}
            style={{ borderRadius: '12px', padding: '8px 28px' }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminUsersPage;
