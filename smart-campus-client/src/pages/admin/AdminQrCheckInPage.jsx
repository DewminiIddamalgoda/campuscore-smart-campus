import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Row,
  Spinner,
  Table,
  Toast,
  ToastContainer
} from 'react-bootstrap';
import { Html5Qrcode } from 'html5-qrcode';
import bookingApi from '../../api/bookingApi';

const AdminQrCheckInPage = () => {
  const scannerRef = useRef(null);
  const scanLockRef = useRef(false);

  const [loading, setLoading] = useState(true);
  const [cameraBusy, setCameraBusy] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [error, setError] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [lastCheckedInBooking, setLastCheckedInBooking] = useState(null);

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        setLoading(true);
        const bookings = await bookingApi.getBookings();
        const checkedIn = bookings
          .filter((booking) => Boolean(booking.checkedInAt))
          .sort((a, b) => new Date(b.checkedInAt) - new Date(a.checkedInAt));
        setAttendanceRecords(checkedIn);
      } catch (loadError) {
        setError(
          loadError?.response?.data?.message ||
            'Unable to load attendance records right now.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadAttendance();

    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .catch(() => undefined)
          .finally(() => {
            scannerRef.current?.clear().catch(() => undefined);
            scannerRef.current = null;
          });
      }
    };
  }, []);

  const handleCheckInWithToken = async (token) => {
    if (!token || scanLockRef.current) {
      return;
    }

    try {
      scanLockRef.current = true;
      const checkedInBooking = await bookingApi.checkInBookingQr(token.trim());
      setLastCheckedInBooking(checkedInBooking);
      setToastVisible(true);
      setError('');
      setAttendanceRecords((current) => {
        const withoutDuplicate = current.filter((item) => item.id !== checkedInBooking.id);
        return [checkedInBooking, ...withoutDuplicate].sort(
          (a, b) => new Date(b.checkedInAt) - new Date(a.checkedInAt)
        );
      });
    } catch (checkInError) {
      const errorMessage = checkInError?.response?.data?.message;
      let displayError = errorMessage || 'Failed to record attendance for this QR code.';
      
      // Make window-related errors more prominent
      if (errorMessage?.includes('Check-in window closed')) {
        displayError = `⏰ ${displayError}`;
      }
      
      setError(displayError);
    } finally {
      setTimeout(() => {
        scanLockRef.current = false;
      }, 1200);
    }
  };

  const startCamera = async () => {
    if (cameraBusy || cameraActive) {
      return;
    }

    try {
      setCameraBusy(true);
      setError('');

      const html5QrCode = new Html5Qrcode('qr-reader');
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 260, height: 260 },
          aspectRatio: 1.0
        },
        (decodedText) => {
          handleCheckInWithToken(decodedText);
        },
        () => undefined
      );

      setCameraActive(true);
    } catch (cameraError) {
      setError(
        cameraError?.message ||
          'Unable to start camera scanner. Check camera permission and try again.'
      );
    } finally {
      setCameraBusy(false);
    }
  };

  const stopCamera = async () => {
    if (!scannerRef.current || cameraBusy) {
      return;
    }

    try {
      setCameraBusy(true);
      await scannerRef.current.stop();
      await scannerRef.current.clear();
      scannerRef.current = null;
      setCameraActive(false);
    } catch (cameraError) {
      setError(cameraError?.message || 'Unable to stop camera scanner cleanly.');
    } finally {
      setCameraBusy(false);
    }
  };

  return (
    <div
      className="admin-qr-checkin-page"
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
                <h2 className="fw-bold mb-2 text-white">QR Check-in Desk</h2>
                <p className="mb-0 text-light opacity-75">
                  Scan approved booking QR codes and record attendance instantly.
                </p>
              </div>
              <div className="text-md-end">
                <div className="small opacity-75">Connected to booking attendance</div>
              </div>
            </div>
          </Card.Body>
        </Card>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Row className="g-4">
          <Col lg={5}>
            <Card className="shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Camera Scanner</h5>
                  <Badge bg={cameraActive ? 'success' : 'secondary'}>
                    {cameraActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div
                  id="qr-reader"
                  style={{ minHeight: '320px', borderRadius: '8px', overflow: 'hidden' }}
                  className="border"
                />

                <div className="d-flex gap-2 mt-3">
                  <Button variant="dark" onClick={startCamera} disabled={cameraBusy || cameraActive}>
                    {cameraBusy && !cameraActive ? 'Starting...' : 'Start Scanner'}
                  </Button>
                  <Button variant="outline-secondary" onClick={stopCamera} disabled={cameraBusy || !cameraActive}>
                    {cameraBusy && cameraActive ? 'Stopping...' : 'Stop Scanner'}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={7}>
            <Card className="shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Attendance Recorded</h5>
                  <Badge bg="info">{attendanceRecords.length} records</Badge>
                </div>

                {loading ? (
                  <div className="text-center py-4">
                    <Spinner animation="border" role="status" />
                  </div>
                ) : attendanceRecords.length === 0 ? (
                  <p className="text-muted mb-0">
                    No attendance has been recorded yet.
                  </p>
                ) : (
                  <div className="table-responsive">
                    <Table hover bordered className="align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Resource</th>
                          <th>Booked By</th>
                          <th>Date</th>
                          <th>Time Slot</th>
                          <th>Checked In At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendanceRecords.map((booking) => (
                          <tr key={booking.id}>
                            <td>{booking.resourceName || booking.resourceId}</td>
                            <td>{booking.bookedByName}</td>
                            <td>{booking.bookingDate}</td>
                            <td>
                              {booking.startTime} - {booking.endTime}
                            </td>
                            <td>{new Date(booking.checkedInAt).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <ToastContainer position="top-end" className="p-3">
        <Toast
          bg="success"
          show={toastVisible}
          onClose={() => setToastVisible(false)}
          delay={2600}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Attendance Recorded</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            {lastCheckedInBooking
              ? `${lastCheckedInBooking.bookedByName} checked in for ${lastCheckedInBooking.resourceName || 'booking'}.`
              : 'Booking attendance recorded successfully.'}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <style>{`
        .admin-qr-checkin-page .card {
          border-radius: 1.25rem;
          border: 0;
        }

        .admin-qr-checkin-page .table-responsive {
          background: #fff;
          border-radius: 1.25rem;
          border: 1px solid rgba(226, 232, 240, 0.9);
        }

        .admin-qr-checkin-page table thead th {
          background: #f8fafc;
          color: #475569;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
};

export default AdminQrCheckInPage;
