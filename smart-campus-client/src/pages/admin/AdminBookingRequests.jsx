import React, { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Table,
  Modal,
  Form,
  Alert,
  Spinner,
  InputGroup,
  FormControl,
  Dropdown
} from 'react-bootstrap';
import { FaCheckCircle, FaTimesCircle, FaEye, FaFilter } from 'react-icons/fa';
import bookingApi from '../../api/bookingApi';
import resourceApi from '../../api/resourceApi';
import './AdminBookingRequests.css';

const AdminBookingRequests = () => {
  const [bookings, setBookings] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filters
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [resourceFilter, setResourceFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewStatus, setReviewStatus] = useState('APPROVED');
  const [rejectionReason, setRejectionReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const STATUS_BADGE = {
    PENDING: 'warning',
    APPROVED: 'success',
    REJECTED: 'danger',
    CANCELLED: 'secondary'
  };

  const STATUS_LABEL = {
    PENDING: '⏳ Pending',
    APPROVED: '✅ Approved',
    REJECTED: '❌ Rejected',
    CANCELLED: '⊘ Cancelled'
  };

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      setLoading(true);
      const [bookingsData, resourcesData] = await Promise.all([
        bookingApi.getBookings(),
        resourceApi.getAllResources()
      ]);
      setBookings(bookingsData);
      setResources(resourcesData);
    } catch (err) {
      setError('Failed to load booking requests. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getResourceName = (resourceId) => {
    const resource = resources.find(r => r.id === resourceId);
    return resource ? resource.name : 'Unknown';
  };

  const filteredBookings = bookings.filter(booking => {
    if (statusFilter && booking.status !== statusFilter) return false;
    if (resourceFilter && booking.resourceId !== resourceFilter) return false;
    if (dateFilter && booking.bookingDate !== dateFilter) return false;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        booking.bookedByName.toLowerCase().includes(search) ||
        booking.bookedByEmail.toLowerCase().includes(search) ||
        booking.purpose.toLowerCase().includes(search)
      );
    }
    return true;
  });

  const handleReviewClick = (booking) => {
    setSelectedBooking(booking);
    setReviewStatus('APPROVED');
    setRejectionReason('');
    setShowReviewModal(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (reviewStatus === 'REJECTED' && !rejectionReason.trim()) {
      setError('Please provide a rejection reason');
      return;
    }

    setSubmitting(true);
    try {
      const updatedBooking = await bookingApi.reviewBooking(
        selectedBooking.id,
        reviewStatus,
        rejectionReason
      );

      // Update local state
      setBookings(prev =>
        prev.map(b => (b.id === updatedBooking.id ? updatedBooking : b))
      );

      setSuccess(
        `Booking ${reviewStatus === 'APPROVED' ? 'approved' : 'rejected'} successfully!`
      );
      setShowReviewModal(false);
      setSelectedBooking(null);
      setRejectionReason('');

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(
        err?.response?.data?.message || 'Failed to process booking review'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-booking-requests py-5">
        <Container>
          <div className="text-center">
            <Spinner animation="border" role="status" />
            <p className="mt-3">Loading booking requests...</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div
      className="admin-booking-requests"
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
                <h2 className="fw-bold mb-2 text-white">Booking Review Center</h2>
                <p className="mb-0 text-light opacity-75">
                  Review, approve, or reject booking requests. Manage pending bookings and view history.
                </p>
              </div>
              <div className="text-md-end">
                <div className="small opacity-75">Connected to bookings backend</div>
              </div>
            </div>
          </Card.Body>
        </Card>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert variant="success" dismissible onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {/* Filters Card */}
        <Card className="shadow-sm mb-4 border-0">
          <Card.Body>
            <Row className="g-3">
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="small fw-bold">Status Filter</Form.Label>
                  <Form.Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    size="sm"
                  >
                    <option value="">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="CANCELLED">Cancelled</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label className="small fw-bold">Resource</Form.Label>
                  <Form.Select
                    value={resourceFilter}
                    onChange={(e) => setResourceFilter(e.target.value)}
                    size="sm"
                  >
                    <option value="">All Resources</option>
                    {resources.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label className="small fw-bold">Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    size="sm"
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label className="small fw-bold">Search</Form.Label>
                  <InputGroup size="sm">
                    <FormControl
                      placeholder="Name, email, purpose..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Bookings Table */}
        <Card className="shadow-sm border-0">
          <Card.Body>
            <div className="table-responsive">
              {filteredBookings.length === 0 ? (
                <p className="text-muted text-center py-4 mb-0">
                  No booking requests match your filters.
                </p>
              ) : (
                <Table hover bordered className="mb-0 align-middle">
                  <thead className="bg-light">
                    <tr>
                      <th>Requester</th>
                      <th>Email</th>
                      <th>Resource</th>
                      <th>Date & Time</th>
                      <th>Purpose</th>
                      <th>Attendees</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map(booking => (
                      <tr key={booking.id}>
                        <td className="fw-500">{booking.bookedByName}</td>
                        <td>
                          <small className="text-muted">{booking.bookedByEmail}</small>
                        </td>
                        <td>{getResourceName(booking.resourceId)}</td>
                        <td>
                          <small>
                            {booking.bookingDate}
                            <br />
                            {booking.startTime} - {booking.endTime}
                          </small>
                        </td>
                        <td>
                          <small>{booking.purpose || '-'}</small>
                        </td>
                        <td className="text-center">{booking.attendeeCount}</td>
                        <td>
                          <Badge bg={STATUS_BADGE[booking.status]}>
                            {STATUS_LABEL[booking.status]}
                          </Badge>
                          {booking.rejectionReason && (
                            <div className="small text-muted mt-1">
                              {booking.rejectionReason}
                            </div>
                          )}
                        </td>
                        <td>
                          {booking.status === 'PENDING' ? (
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => handleReviewClick(booking)}
                            >
                              <FaEye className="me-1" /> Review
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline-secondary"
                              onClick={() => handleReviewClick(booking)}
                              disabled={booking.status === 'CANCELLED'}
                            >
                              <FaEye className="me-1" /> View
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </div>
          </Card.Body>
          <Card.Footer className="bg-light small text-muted">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </Card.Footer>
        </Card>
      </Container>

      {/* Review Modal */}
      <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Review Booking Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooking && (
            <Form onSubmit={handleReviewSubmit}>
              <div className="mb-4 p-3 bg-light rounded">
                <Row className="g-3">
                  <Col md={6}>
                    <div>
                      <strong>Requested By</strong>
                      <p className="mb-0">{selectedBooking.bookedByName}</p>
                      <small className="text-muted">{selectedBooking.bookedByEmail}</small>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div>
                      <strong>Resource</strong>
                      <p className="mb-0">{getResourceName(selectedBooking.resourceId)}</p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div>
                      <strong>Date</strong>
                      <p className="mb-0">{selectedBooking.bookingDate}</p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div>
                      <strong>Time</strong>
                      <p className="mb-0">
                        {selectedBooking.startTime} - {selectedBooking.endTime}
                      </p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div>
                      <strong>Purpose</strong>
                      <p className="mb-0">{selectedBooking.purpose}</p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div>
                      <strong>Attendees</strong>
                      <p className="mb-0">{selectedBooking.attendeeCount}</p>
                    </div>
                  </Col>
                  {selectedBooking.notes && (
                    <Col xs={12}>
                      <div>
                        <strong>Notes</strong>
                        <p className="mb-0 text-muted">{selectedBooking.notes}</p>
                      </div>
                    </Col>
                  )}
                </Row>
              </div>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Decision *</Form.Label>
                <Form.Select
                  value={reviewStatus}
                  onChange={(e) => setReviewStatus(e.target.value)}
                >
                  <option value="APPROVED">✅ Approve</option>
                  <option value="REJECTED">❌ Reject</option>
                </Form.Select>
              </Form.Group>

              {reviewStatus === 'REJECTED' && (
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Rejection Reason *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Provide a clear reason for rejection (e.g., Conflict with another booking, Resource unavailable, etc.)"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    required
                  />
                  <Form.Text className="text-muted">
                    The user will see this reason in their booking dashboard.
                  </Form.Text>
                </Form.Group>
              )}

              <div className="d-flex gap-2 justify-content-end">
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowReviewModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  variant={reviewStatus === 'APPROVED' ? 'success' : 'danger'}
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? 'Processing...' : (reviewStatus === 'APPROVED' ? 'Approve' : 'Reject')}
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminBookingRequests;
