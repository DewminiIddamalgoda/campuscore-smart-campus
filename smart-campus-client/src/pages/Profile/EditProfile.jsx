import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { useToast } from '../../components/common/ToastProvider.jsx';
import './ProfileStyles.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const EditProfile = () => {
  const { user, updateLocalUser } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ newPassword: '', confirmNewPassword: '', contactNumber: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setForm((f) => ({ ...f, contactNumber: user?.contactNumber || '' }));
  }, [user?.contactNumber]);

  const validateSriLankaPhone = (phone) => /^0\d{9}$/.test(phone);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.newPassword || form.confirmNewPassword) {
      if (form.newPassword !== form.confirmNewPassword) {
        setError('Confirm password must match the new password');
        return;
      }
    }

    if (form.contactNumber && !validateSriLankaPhone(form.contactNumber)) {
      setError('Contact number must be a valid Sri Lankan 10-digit number');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        contactNumber: form.contactNumber,
      };

      if (form.newPassword) {
        payload.newPassword = form.newPassword;
        payload.confirmNewPassword = form.confirmNewPassword;
      }

      const response = await axios.put(`${API_BASE_URL}/auth/me`, payload);

      // update session user info
      if (response?.data) {
        updateLocalUser(response.data);
      }

      toast.showToast('success', 'Changes saved successfully');
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.details || 'Unable to update profile right now.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-page">
      <Container>
        <div className="profile-panel">
          <Row>
            <Col md={8} className="mx-auto">
              <div className="profile-card p-4 p-md-5">
                <div className="profile-header">
                  <div>
                    <h2>Edit Profile</h2>
                    <p className="profile-subtitle">Update your contact number and password with a refreshed, secure form.</p>
                  </div>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Contact Number</Form.Label>
                    <Form.Control className="modern-input" name="contactNumber" value={form.contactNumber} onChange={handleChange} placeholder="07XXXXXXXX" maxLength={10} />
                  </Form.Group>

                  <div className="form-section-divider" />

                  <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control className="modern-input" type="password" name="newPassword" value={form.newPassword} onChange={handleChange} />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control className="modern-input" type="password" name="confirmNewPassword" value={form.confirmNewPassword} onChange={handleChange} />
                  </Form.Group>

                  <div className="profile-actions mt-4">
                    <Button type="submit" disabled={loading} className="btn modern-btn">
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default EditProfile;
