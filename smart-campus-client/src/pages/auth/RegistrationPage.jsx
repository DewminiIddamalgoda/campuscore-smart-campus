import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AuthPages.css';

const FACULTIES = [
  { label: 'Computing', prefix: 'IT' },
  { label: 'Engineering', prefix: 'EN' },
  { label: 'Business', prefix: 'BS' },
  { label: 'Humanities', prefix: 'HM' },
];

const ROLE_META = {
  student: {
    title: 'Student Registration',
    subtitle: 'Register with your faculty, academic year, and student user ID.',
    roleLabel: 'Student',
    buttonLabel: 'Register as Student',
    type: 'student',
  },
  admin: {
    title: 'Admin Registration',
    subtitle: 'Create an admin account with auto-generated staff credentials.',
    roleLabel: 'Admin',
    buttonLabel: 'Register as Admin',
    type: 'admin',
    autoUserIdPrefix: 'AD',
  },
  technician: {
    title: 'Technician Registration',
    subtitle: 'Create a technician account with admin-level access privileges.',
    roleLabel: 'Technician',
    buttonLabel: 'Register as Technician',
    type: 'technician',
    autoUserIdPrefix: 'TN',
  },
};

const initialFormState = {
  firstName: '',
  lastName: '',
  email: '',
  contactNumber: '',
  faculty: 'Computing',
  academicYear: '',
  userId: '',
  password: '',
  confirmPassword: '',
};

const passwordRules = [
  { id: 'length', label: 'At least 8 characters', test: (value) => value.length >= 8 },
  { id: 'uppercase', label: '1 uppercase letter', test: (value) => /[A-Z]/.test(value) },
  { id: 'lowercase', label: '1 lowercase letter', test: (value) => /[a-z]/.test(value) },
  { id: 'number', label: '1 number', test: (value) => /\d/.test(value) },
  { id: 'special', label: '1 special character', test: (value) => /[^A-Za-z0-9]/.test(value) },
];

const createStaffUserId = (prefix) => {
  const digits = String(Math.floor(Math.random() * 100000000)).padStart(8, '0');
  return `${prefix}${digits}`;
};

const RegistrationPage = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { registerStudent, registerAdmin, registerTechnician } = useAuth();
  const meta = ROLE_META[role];
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const selectedFacultyPrefix = useMemo(() => {
    const faculty = FACULTIES.find((item) => item.label === formData.faculty);
    return faculty?.prefix || 'IT';
  }, [formData.faculty]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const email = params.get('email');
    const fullName = params.get('fullName');
    const firstName = params.get('firstName');
    const lastName = params.get('lastName');
    const notice = params.get('message');

    if (notice) {
      setMessage({ type: 'info', text: notice });
    }

    const nameSource = fullName || '';
    const inferredFirstName = firstName || nameSource.split(' ')[0] || '';
    const inferredLastName = lastName || nameSource.split(' ').slice(1).join(' ') || '';

    setFormData((current) => {
      const nextState = {
        ...current,
        firstName: inferredFirstName || current.firstName,
        lastName: inferredLastName || current.lastName,
        email: email || current.email,
      };

      if (role !== 'student' && !current.userId) {
        nextState.userId = createStaffUserId(meta?.autoUserIdPrefix || 'AD');
      }

      return nextState;
    });
  }, [location.search, meta?.autoUserIdPrefix, role]);

  useEffect(() => {
    if (role === 'student') {
      return;
    }

    setFormData((current) => ({
      ...current,
      userId: current.userId || createStaffUserId(meta?.autoUserIdPrefix || 'AD'),
    }));
  }, [meta?.autoUserIdPrefix, role]);

  if (!meta) {
    return (
      <div className="auth-page">
        <Container className="auth-shell">
          <Alert variant="danger">Invalid registration type.</Alert>
          <Button onClick={() => navigate('/register')}>Go back</Button>
        </Container>
      </div>
    );
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const validate = () => {
    const errors = [];

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.contactNumber ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      errors.push('All required fields must be filled.');
    }

    if (!/^0\d{9}$/.test(formData.contactNumber)) {
      errors.push('Contact number must be a valid Sri Lankan 10-digit number.');
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(formData.password)) {
      errors.push('Password does not meet the required strength rules.');
    }

    if (formData.password !== formData.confirmPassword) {
      errors.push('Passwords do not match');
    }

    if (role === 'student') {
      if (!formData.userId || !new RegExp(`^${selectedFacultyPrefix}\\d{8}$`).test(formData.userId.trim().toUpperCase())) {
        errors.push('Enter a valid user ID');
      }
    } else if (!new RegExp(`^${meta.autoUserIdPrefix}\\d{8}$`).test(formData.userId.trim().toUpperCase())) {
      errors.push('Enter a valid user ID');
    }

    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage({ type: '', text: '' });

    const errors = validate();
    if (errors.length > 0) {
      setMessage({ type: 'danger', text: errors[0] });
      return;
    }

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      contactNumber: formData.contactNumber,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      userId: formData.userId.trim().toUpperCase(),
    };

    if (role === 'student') {
      payload.faculty = formData.faculty;
      payload.academicYear = formData.academicYear;
    }

    try {
      setLoading(true);

      const response =
        role === 'student'
          ? await registerStudent(payload)
          : role === 'admin'
            ? await registerAdmin(payload)
            : await registerTechnician(payload);

      navigate(response.redirectPath || (role === 'student' ? '/' : '/admin/dashboard'));
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.details ||
        'Unable to register right now.';
      setMessage({ type: 'danger', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = useMemo(
    () =>
      passwordRules.map((rule) => ({
        ...rule,
        passed: rule.test(formData.password),
      })),
    [formData.password],
  );

  return (
    <div className="auth-page">
      <Container className="auth-shell">
        <Row className="justify-content-center">
          <Col xl={10} lg={11}>
            <div className="auth-card modern-card">
              <div className="auth-card-header">
                <span className="auth-badge">{meta.roleLabel}</span>
                <h1>{meta.title}</h1>
                <p>{meta.subtitle}</p>
              </div>

              {message.text && (
                <Alert variant={message.type || 'info'} dismissible onClose={() => setMessage({ type: '', text: '' })}>
                  {message.text}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>First Name*</Form.Label>
                      <Form.Control
                        className="auth-input"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Last Name*</Form.Label>
                      <Form.Control
                        className="auth-input"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>{role === 'student' ? 'Student Email*' : 'University Email*'}</Form.Label>
                      <Form.Control
                        type="email"
                        className="auth-input"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Contact Number*</Form.Label>
                      <Form.Control
                        className="auth-input"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        placeholder="07XXXXXXXX"
                        maxLength={10}
                        required
                      />
                    </Form.Group>
                  </Col>

                  {role === 'student' && (
                    <>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Faculty*</Form.Label>
                          <Form.Select
                            className="auth-input"
                            name="faculty"
                            value={formData.faculty}
                            onChange={handleChange}
                            required
                          >
                            {FACULTIES.map((faculty) => (
                              <option key={faculty.label} value={faculty.label}>
                                {faculty.label}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Academic Year*</Form.Label>
                          <Form.Select
                            className="auth-input"
                            name="academicYear"
                            value={formData.academicYear}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select academic year</option>
                            <option value="Year 1">Year 1</option>
                            <option value="Year 2">Year 2</option>
                            <option value="Year 3">Year 3</option>
                            <option value="Year 4">Year 4</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>User Type*</Form.Label>
                          <Form.Control className="auth-input" value="Student" readOnly />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>User ID*</Form.Label>
                          <Form.Control
                            className="auth-input"
                            name="userId"
                            value={formData.userId}
                            onChange={handleChange}
                            placeholder={`${selectedFacultyPrefix}########`}
                            maxLength={10}
                            required
                          />
                          <Form.Text className="text-muted">
                            Must match your faculty prefix and include 8 digits.
                          </Form.Text>
                        </Form.Group>
                      </Col>
                    </>
                  )}

                  {role !== 'student' && (
                    <>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>User Type*</Form.Label>
                          <Form.Control className="auth-input" value={meta.roleLabel} readOnly />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>User ID*</Form.Label>
                          <Form.Control
                            className="auth-input"
                            name="userId"
                            value={formData.userId}
                            readOnly
                          />
                          <Form.Text className="text-muted">
                            Automatically assigned staff ID.
                          </Form.Text>
                        </Form.Group>
                      </Col>
                    </>
                  )}

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Password*</Form.Label>
                      <Form.Control
                        type="password"
                        className="auth-input"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      <div className="password-rules">
                        {passwordStrength.map((rule) => (
                          <div key={rule.id} className={`password-rule ${rule.passed ? 'passed' : ''}`}>
                            <span className="rule-dot">{rule.passed ? '✓' : '•'}</span>
                            <span>{rule.label}</span>
                          </div>
                        ))}
                      </div>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Confirm Password*</Form.Label>
                      <Form.Control
                        type="password"
                        className="auth-input"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                      {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <Form.Text className="text-danger">Passwords do not match</Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <div className="auth-actions">
                  <Button type="submit" className="auth-primary-btn" disabled={loading}>
                    {loading ? 'Registering...' : meta.buttonLabel}
                  </Button>
                  <Button type="button" variant="outline-secondary" onClick={() => navigate('/register')}>
                    Back
                  </Button>
                </div>
              </Form>

              <div className="auth-links">
                <Link to="/#login" className="auth-link">
                  Already have an account? Click here to login
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RegistrationPage;
