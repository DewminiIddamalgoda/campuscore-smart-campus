import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import bookingApi from '../../api/bookingApi';
import resourceApi from '../../api/resourceApi';
import './BookingPage.css';

const STATUS_VARIANTS = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'danger',
  CANCELLED: 'secondary'
};

const EMPTY_FORM = {
  resourceId: '',
  bookedByName: '',
  bookedByEmail: '',
  purpose: '',
  attendeeCount: '',
  bookingDate: '',
  startTime: '',
  endTime: '',
  notes: ''
};

const BookingPage = () => {
  const location = useLocation();
  const [resources, setResources] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [filters, setFilters] = useState({
    resourceId: '',
    bookingDate: '',
    status: ''
  });
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [editingBookingId, setEditingBookingId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [validationErrors, setValidationErrors] = useState({});

  const routeSelectedResourceId = useMemo(() => {
    const fromState = location.state?.selectedResourceId;
    if (fromState) {
      return fromState;
    }

    const searchParams = new URLSearchParams(location.search || '');
    return searchParams.get('resourceId') || '';
  }, [location.search, location.state]);

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  const activeResources = useMemo(
    () => resources.filter((resource) => resource.status === 'ACTIVE'),
    [resources]
  );

  const selectedResource = useMemo(
    () => activeResources.find((resource) => resource.id === formData.resourceId) || null,
    [activeResources, formData.resourceId]
  );

  const relevantBookings = useMemo(() => {
    if (!formData.resourceId || !formData.bookingDate) return [];

    return bookings
      .filter(
        (booking) =>
          booking.resourceId === formData.resourceId &&
          booking.bookingDate === formData.bookingDate &&
          booking.status !== 'CANCELLED' &&
          booking.status !== 'REJECTED'
      )
      .sort((a, b) => `${a.startTime}`.localeCompare(`${b.startTime}`));
  }, [bookings, formData.bookingDate, formData.resourceId]);

  useEffect(() => {
    const initializePage = async () => {
      try {
        const [resourceData, bookingData] = await Promise.all([
          resourceApi.getAllResources(),
          bookingApi.getBookings()
        ]);

        setResources(resourceData);
        setBookings(bookingData);

        if (routeSelectedResourceId) {
          const canPreselectResource = resourceData.some(
            (resource) => resource.id === routeSelectedResourceId && resource.status === 'ACTIVE'
          );

          if (canPreselectResource) {
            setFormData((current) => ({
              ...current,
              resourceId: routeSelectedResourceId
            }));
          }
        }
      } catch (error) {
        setFeedback({
          type: 'danger',
          message: 'Failed to load booking data. Please refresh and try again.'
        });
      } finally {
        setLoading(false);
      }
    };

    initializePage();
  }, [routeSelectedResourceId]);

  const refreshBookings = async (nextFilters = filters) => {
    const bookingData = await bookingApi.getBookings(nextFilters);
    setBookings(bookingData);
  };

  const handleFilterChange = async (event) => {
    const { name, value } = event.target;
    const nextFilters = {
      ...filters,
      [name]: value
    };

    setFilters(nextFilters);

    try {
      setLoading(true);
      await refreshBookings(nextFilters);
    } catch (error) {
      setFeedback({
        type: 'danger',
        message: 'Unable to filter bookings right now.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setValidationErrors((current) => {
      if (!current[name] && name !== 'startTime' && name !== 'endTime') {
        return current;
      }

      const next = { ...current };
      delete next[name];

      if (name === 'startTime' || name === 'endTime') {
        delete next.startTime;
        delete next.endTime;
      }

      return next;
    });

    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  };

  const validateClientForm = () => {
    const errors = {};

    if (formData.bookingDate && formData.bookingDate < today) {
      errors.bookingDate = 'Booking date must be today or later';
    }

    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      errors.endTime = 'End time must be later than start time';
    }

    if (selectedResource?.capacity != null && Number(formData.attendeeCount) > selectedResource.capacity) {
      errors.attendeeCount = `Attendee count cannot exceed capacity (${selectedResource.capacity})`;
    }

    return errors;
  };

  const resetBookingForm = () => {
    setFormData(EMPTY_FORM);
    setEditingBookingId('');
    setValidationErrors({});
    setFeedback({ type: '', message: '' });
  };

  const handleEditBooking = (booking) => {
    setEditingBookingId(booking.id);
    setValidationErrors({});
    setFormData({
      resourceId: booking.resourceId || '',
      bookedByName: booking.bookedByName || '',
      bookedByEmail: booking.bookedByEmail || '',
      purpose: booking.purpose || '',
      attendeeCount: booking.attendeeCount != null ? String(booking.attendeeCount) : '',
      bookingDate: booking.bookingDate || '',
      startTime: booking.startTime || '',
      endTime: booking.endTime || '',
      notes: booking.notes || ''
    });

    setFeedback({
      type: 'info',
      message: 'Editing booking. Update details and save changes.'
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setFeedback({ type: '', message: '' });
    setValidationErrors({});

    const clientErrors = validateClientForm();
    if (Object.keys(clientErrors).length > 0) {
      setValidationErrors(clientErrors);
      setFeedback({
        type: 'danger',
        message: Object.values(clientErrors)[0]
      });
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        attendeeCount: Number(formData.attendeeCount)
      };

      if (editingBookingId) {
        await bookingApi.updateBooking(editingBookingId, payload);
      } else {
        await bookingApi.createBooking(payload);
      }

      setFormData(EMPTY_FORM);
      setEditingBookingId('');
      setValidationErrors({});
      await refreshBookings();
      setFeedback({
        type: 'success',
        message: editingBookingId
          ? 'Booking updated successfully.'
          : 'Booking request submitted successfully.'
      });
    } catch (error) {
      const backendFieldErrors = error?.response?.data?.errors;
      if (backendFieldErrors && typeof backendFieldErrors === 'object') {
        setValidationErrors(backendFieldErrors);
      }

      const serverMessage =
        (backendFieldErrors && Object.values(backendFieldErrors)[0]) ||
        error?.response?.data?.message ||
        error?.response?.data?.details ||
        'Unable to create the booking right now.';

      setFeedback({
        type: 'danger',
        message: serverMessage
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      await bookingApi.updateBookingStatus(bookingId, status);
      await refreshBookings();
      setFeedback({
        type: 'success',
        message: `Booking marked as ${status.toLowerCase()}.`
      });
    } catch (error) {
      setFeedback({
        type: 'danger',
        message:
          error?.response?.data?.message ||
          'Unable to update booking status right now.'
      });
    }
  };

  const handleDelete = async (bookingId) => {
    try {
      await bookingApi.deleteBooking(bookingId);
      await refreshBookings();
      setFeedback({
        type: 'success',
        message: 'Booking deleted successfully.'
      });
    } catch (error) {
      setFeedback({
        type: 'danger',
        message:
          error?.response?.data?.message ||
          'Unable to delete booking right now.'
      });
    }
  };

  if (loading && bookings.length === 0 && resources.length === 0) {
    return (
      <div className="booking-page booking-loading">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  return (
    <div className="booking-page">
      <section className="booking-hero">
        <Container>
          <p className="booking-eyebrow">Booking Workflow</p>
          <h1>Reserve campus resources with conflict protection</h1>
          <p className="booking-intro">
            Submit booking requests, review the daily schedule, and manage approval states
            without overlapping time slots on the same resource.
          </p>
        </Container>
      </section>

      <section className="booking-content">
        <Container>
          {feedback.message && (
            <Alert
              variant={feedback.type || 'info'}
              dismissible
              onClose={() => setFeedback({ type: '', message: '' })}
            >
              {feedback.message}
            </Alert>
          )}

          <Row className="g-4 align-items-start">
            <Col lg={5}>
              <Card className="booking-card shadow-sm">
                <Card.Body>
                  <div className="booking-section-heading">
                    <h2>{editingBookingId ? 'Edit Booking' : 'Create Booking'}</h2>
                    <p>
                      {editingBookingId
                        ? 'Update booking details and save changes.'
                        : 'Choose an active resource and request a time slot.'}
                    </p>
                  </div>

                  <Form onSubmit={handleSubmit}>
                    <Row className="g-3">
                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label>Resource</Form.Label>
                          <Form.Select
                            name="resourceId"
                            value={formData.resourceId}
                            onChange={handleFormChange}
                            isInvalid={Boolean(validationErrors.resourceId)}
                            required
                          >
                            <option value="">Select a resource</option>
                            {activeResources.map((resource) => (
                              <option key={resource.id} value={resource.id}>
                                {resource.name} | {resource.location}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {validationErrors.resourceId}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Booked By</Form.Label>
                          <Form.Control
                            name="bookedByName"
                            value={formData.bookedByName}
                            onChange={handleFormChange}
                            isInvalid={Boolean(validationErrors.bookedByName)}
                            placeholder="Your name"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {validationErrors.bookedByName}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            name="bookedByEmail"
                            value={formData.bookedByEmail}
                            onChange={handleFormChange}
                            isInvalid={Boolean(validationErrors.bookedByEmail)}
                            placeholder="name@example.com"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {validationErrors.bookedByEmail}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label>Purpose</Form.Label>
                          <Form.Control
                            name="purpose"
                            value={formData.purpose}
                            onChange={handleFormChange}
                            isInvalid={Boolean(validationErrors.purpose)}
                            placeholder="Lecture, presentation, lab session..."
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {validationErrors.purpose}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Attendees</Form.Label>
                          <Form.Control
                            type="number"
                            min="1"
                            max={selectedResource?.capacity || undefined}
                            name="attendeeCount"
                            value={formData.attendeeCount}
                            onChange={handleFormChange}
                            isInvalid={Boolean(validationErrors.attendeeCount)}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {validationErrors.attendeeCount}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Date</Form.Label>
                          <Form.Control
                            type="date"
                            name="bookingDate"
                            value={formData.bookingDate}
                            onChange={handleFormChange}
                            min={today}
                            isInvalid={Boolean(validationErrors.bookingDate)}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {validationErrors.bookingDate}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={2}>
                        <Form.Group>
                          <Form.Label>Start</Form.Label>
                          <Form.Control
                            type="time"
                            name="startTime"
                            value={formData.startTime}
                            onChange={handleFormChange}
                            isInvalid={Boolean(validationErrors.startTime)}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {validationErrors.startTime}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={2}>
                        <Form.Group>
                          <Form.Label>End</Form.Label>
                          <Form.Control
                            type="time"
                            name="endTime"
                            value={formData.endTime}
                            onChange={handleFormChange}
                            isInvalid={Boolean(validationErrors.endTime)}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {validationErrors.endTime}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label>Notes</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            name="notes"
                            value={formData.notes}
                            onChange={handleFormChange}
                            placeholder="Optional details for the approver"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    {selectedResource && (
                      <div className="booking-resource-meta">
                        <strong>{selectedResource.name}</strong>
                        <span>{selectedResource.location}</span>
                        <span>
                          Capacity {selectedResource.capacity} | Available {selectedResource.availableFrom} -{' '}
                          {selectedResource.availableTo}
                        </span>
                      </div>
                    )}

                    <div className="booking-actions">
                      <Button type="submit" className="booking-primary-btn" disabled={submitting}>
                        {submitting ? 'Submitting...' : editingBookingId ? 'Save Changes' : 'Submit Booking'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline-secondary"
                        onClick={resetBookingForm}
                        disabled={submitting}
                      >
                        {editingBookingId ? 'Cancel Edit' : 'Reset'}
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>

              <Card className="booking-card shadow-sm schedule-card">
                <Card.Body>
                  <div className="booking-section-heading">
                    <h2>Conflict Preview</h2>
                    <p>
                      Existing pending and approved bookings for the selected resource and date.
                    </p>
                  </div>

                  {relevantBookings.length === 0 ? (
                    <p className="booking-muted mb-0">
                      Pick a resource and booking date to preview occupied time slots.
                    </p>
                  ) : (
                    <div className="schedule-list">
                      {relevantBookings.map((booking) => (
                        <div key={booking.id} className="schedule-item">
                          <div>
                            <strong>{booking.startTime} - {booking.endTime}</strong>
                            <span>{booking.bookedByName} | {booking.purpose}</span>
                          </div>
                          <Badge bg={STATUS_VARIANTS[booking.status] || 'primary'}>
                            {booking.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col lg={7}>
              <Card className="booking-card shadow-sm">
                <Card.Body>
                  <div className="booking-section-heading">
                    <h2>Booking Queue</h2>
                    <p>Monitor requests, filter by date, and manage the booking workflow.</p>
                  </div>

                  <Row className="g-3 booking-filter-row">
                    <Col md={5}>
                      <Form.Group>
                        <Form.Label>Resource Filter</Form.Label>
                        <Form.Select
                          name="resourceId"
                          value={filters.resourceId}
                          onChange={handleFilterChange}
                        >
                          <option value="">All resources</option>
                          {activeResources.map((resource) => (
                            <option key={resource.id} value={resource.id}>
                              {resource.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Date Filter</Form.Label>
                        <Form.Control
                          type="date"
                          name="bookingDate"
                          value={filters.bookingDate}
                          onChange={handleFilterChange}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                          name="status"
                          value={filters.status}
                          onChange={handleFilterChange}
                        >
                          <option value="">All statuses</option>
                          <option value="PENDING">Pending</option>
                          <option value="APPROVED">Approved</option>
                          <option value="REJECTED">Rejected</option>
                          <option value="CANCELLED">Cancelled</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="booking-list">
                    {bookings.length === 0 ? (
                      <div className="booking-empty-state">
                        <h3>No bookings yet</h3>
                        <p>Your submitted bookings will appear here.</p>
                      </div>
                    ) : (
                      bookings.map((booking) => (
                        <div key={booking.id} className="booking-list-item">
                          <div className="booking-list-main">
                            <div className="booking-list-topline">
                              <h3>{booking.resourceName || 'Resource booking'}</h3>
                              <Badge bg={STATUS_VARIANTS[booking.status] || 'primary'}>
                                {booking.status}
                              </Badge>
                            </div>
                            <p className="booking-list-meta">
                              {booking.bookingDate} | {booking.startTime} - {booking.endTime}
                            </p>
                            <p className="booking-list-meta">
                              {booking.bookedByName} ({booking.bookedByEmail}) | {booking.attendeeCount} attendees
                            </p>
                            <p className="booking-list-purpose">{booking.purpose}</p>
                            {booking.notes && <p className="booking-list-notes">Notes: {booking.notes}</p>}
                          </div>

                          <div className="booking-list-actions">
                            {booking.status === 'PENDING' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="success"
                                  onClick={() => handleStatusUpdate(booking.id, 'APPROVED')}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-danger"
                                  onClick={() => handleStatusUpdate(booking.id, 'REJECTED')}
                                >
                                  Reject
                                </Button>
                              </>
                            )}

                            {(booking.status === 'PENDING' || booking.status === 'APPROVED') && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline-primary"
                                  onClick={() => handleEditBooking(booking)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-secondary"
                                  onClick={() => handleStatusUpdate(booking.id, 'CANCELLED')}
                                >
                                  Cancel
                                </Button>
                              </>
                            )}

                            {(booking.status === 'REJECTED' || booking.status === 'CANCELLED') && (
                              <Button
                                size="sm"
                                variant="outline-dark"
                                onClick={() => handleDelete(booking.id)}
                              >
                                Delete
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default BookingPage;
