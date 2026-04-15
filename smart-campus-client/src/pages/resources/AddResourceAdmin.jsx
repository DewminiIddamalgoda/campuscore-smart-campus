// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
// import resourceApi from '../../api/resourceApi';
// import AdminLayout from '../../components/admin/AdminLayout';

// const styles = {
//   page: {
//     minHeight: '100vh',
//     padding: '24px',
//     backgroundColor: '#f8f9fa',
//     marginLeft: '-250px',
//     width: 'calc(100% + 250px)'
//   },
//   contentWrapper: {
//     width: '100%',
//     margin: 0
//   },
//   topBar: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     gap: '16px',
//     flexWrap: 'wrap',
//     marginBottom: '24px'
//   },
//   title: {
//     margin: 0,
//     fontSize: '2.2rem',
//     fontWeight: '700',
//     color: '#0f172a'
//   },
//   backButton: {
//     padding: '12px 22px',
//     fontWeight: '600',
//     borderRadius: '10px'
//   },
//   card: {
//     width: '100%',
//     border: 'none',
//     borderRadius: '16px',
//     boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
//     overflow: 'hidden',
//     backgroundColor: '#fff'
//   },
//   cardHeader: {
//     padding: '28px 32px 18px',
//     borderBottom: '1px solid #e5e7eb',
//     backgroundColor: '#ffffff'
//   },
//   cardTitle: {
//     margin: 0,
//     fontSize: '2rem',
//     fontWeight: '700',
//     color: '#111827'
//   },
//   cardSubtitle: {
//     marginTop: '10px',
//     marginBottom: 0,
//     color: '#6b7280',
//     fontSize: '1rem'
//   },
//   cardBody: {
//     padding: '28px 32px 32px'
//   },
//   input: {
//     minHeight: '52px',
//     borderRadius: '10px'
//   },
//   textarea: {
//     borderRadius: '10px'
//   },
//   actionRow: {
//     display: 'flex',
//     gap: '12px',
//     flexWrap: 'wrap',
//     marginTop: '28px'
//   },
//   submitButton: {
//     minWidth: '160px',
//     padding: '12px 20px',
//     fontWeight: '600',
//     borderRadius: '10px'
//   },
//   cancelButton: {
//     minWidth: '120px',
//     padding: '12px 20px',
//     fontWeight: '600',
//     borderRadius: '10px'
//   }
// };

// const AddResourceAdmin = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: '',
//     type: 'LECTURE_HALL',
//     capacity: '',
//     location: '',
//     status: 'ACTIVE',
//     availableFrom: '',
//     availableTo: '',
//     description: ''
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [fieldErrors, setFieldErrors] = useState({});

//   const validateForm = () => {
//     const errors = {};

//     if (!formData.name.trim()) {
//       errors.name = 'Resource name is required';
//     } else if (formData.name.length < 3) {
//       errors.name = 'Resource name must be at least 3 characters long';
//     } else if (formData.name.length > 100) {
//       errors.name = 'Resource name must not exceed 100 characters';
//     }

//     if (!formData.capacity) {
//       errors.capacity = 'Capacity is required';
//     } else if (isNaN(formData.capacity) || parseInt(formData.capacity, 10) < 1) {
//       errors.capacity = 'Capacity must be a positive number';
//     } else if (parseInt(formData.capacity, 10) > 1000) {
//       errors.capacity = 'Capacity must not exceed 1000';
//     }

//     if (!formData.location.trim()) {
//       errors.location = 'Location is required';
//     } else if (formData.location.length < 3) {
//       errors.location = 'Location must be at least 3 characters long';
//     } else if (formData.location.length > 200) {
//       errors.location = 'Location must not exceed 200 characters';
//     }

//     const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

//     if (formData.availableFrom && !timeRegex.test(formData.availableFrom)) {
//       errors.availableFrom = 'Available From must be in HH:MM format (e.g., 09:00)';
//     }

//     if (formData.availableTo && !timeRegex.test(formData.availableTo)) {
//       errors.availableTo = 'Available To must be in HH:MM format (e.g., 17:00)';
//     }

//     if (formData.availableFrom && formData.availableTo) {
//       const [fromHour, fromMinute] = formData.availableFrom.split(':').map(Number);
//       const [toHour, toMinute] = formData.availableTo.split(':').map(Number);

//       const fromMinutes = fromHour * 60 + fromMinute;
//       const toMinutes = toHour * 60 + toMinute;

//       if (fromMinutes >= toMinutes) {
//         errors.availableTo = 'Available To must be later than Available From';
//       }
//     }

//     if (formData.description && formData.description.length > 500) {
//       errors.description = 'Description must not exceed 500 characters';
//     }

//     setFieldErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value
//     }));

//     if (fieldErrors[name]) {
//       setFieldErrors((prev) => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);

//     if (!validateForm()) {
//       setError('Please fix the validation errors before submitting.');
//       return;
//     }

//     setLoading(true);

//     try {
//       const resourceData = {
//         ...formData,
//         capacity: parseInt(formData.capacity, 10)
//       };

//       await resourceApi.createResource(resourceData);
//       navigate('/admin/resources');
//     } catch (err) {
//       setError('Failed to create resource. Please check your input and try again.');
//       console.error('Error creating resource:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AdminLayout>
//       <div style={styles.page}>
//         <div style={styles.contentWrapper}>
//           <div style={styles.topBar}>
//             <h1 style={styles.title}>Add New Resource</h1>

//             <Button
//               variant="secondary"
//               style={styles.backButton}
//               onClick={() => navigate('/admin/resources')}
//             >
//               Back to Resources
//             </Button>
//           </div>

//           <div className="card" style={styles.card}>
//             <div style={styles.cardHeader}>
//               <h2 style={styles.cardTitle}>Resource Information</h2>
//               <p style={styles.cardSubtitle}>
//                 Fill in the details below to add a new resource to the system
//               </p>
//             </div>

//             <div style={styles.cardBody}>
//               {error && (
//                 <Alert variant="danger" className="mb-4">
//                   <Alert.Heading>Validation Error</Alert.Heading>
//                   {error}
//                 </Alert>
//               )}

//               <Form onSubmit={handleSubmit}>
//                 <Row className="g-4">
//                   <Col md={6}>
//                     <Form.Group controlId="name">
//                       <Form.Label>Resource Name *</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleChange}
//                         placeholder="e.g., Lab A-401"
//                         className={fieldErrors.name ? 'is-invalid' : ''}
//                         style={styles.input}
//                       />
//                       {fieldErrors.name && (
//                         <Form.Text className="text-danger">{fieldErrors.name}</Form.Text>
//                       )}
//                     </Form.Group>
//                   </Col>

//                   <Col md={6}>
//                     <Form.Group controlId="type">
//                       <Form.Label>Resource Type *</Form.Label>
//                       <Form.Select
//                         name="type"
//                         value={formData.type}
//                         onChange={handleChange}
//                         style={styles.input}
//                       >
//                         <option value="LECTURE_HALL">Lecture Hall</option>
//                         <option value="LAB">Laboratory</option>
//                         <option value="MEETING_ROOM">Meeting Room</option>
//                         <option value="EQUIPMENT">Equipment</option>
//                       </Form.Select>
//                     </Form.Group>
//                   </Col>

//                   <Col md={6}>
//                     <Form.Group controlId="capacity">
//                       <Form.Label>Capacity *</Form.Label>
//                       <Form.Control
//                         type="number"
//                         name="capacity"
//                         value={formData.capacity}
//                         onChange={handleChange}
//                         placeholder="e.g., 50"
//                         min="1"
//                         className={fieldErrors.capacity ? 'is-invalid' : ''}
//                         style={styles.input}
//                       />
//                       {fieldErrors.capacity && (
//                         <Form.Text className="text-danger">{fieldErrors.capacity}</Form.Text>
//                       )}
//                     </Form.Group>
//                   </Col>

//                   <Col md={6}>
//                     <Form.Group controlId="location">
//                       <Form.Label>Location *</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="location"
//                         value={formData.location}
//                         onChange={handleChange}
//                         placeholder="e.g., Building A, Floor 4"
//                         className={fieldErrors.location ? 'is-invalid' : ''}
//                         style={styles.input}
//                       />
//                       {fieldErrors.location && (
//                         <Form.Text className="text-danger">{fieldErrors.location}</Form.Text>
//                       )}
//                     </Form.Group>
//                   </Col>

//                   <Col md={6}>
//                     <Form.Group controlId="status">
//                       <Form.Label>Status</Form.Label>
//                       <Form.Select
//                         name="status"
//                         value={formData.status}
//                         onChange={handleChange}
//                         style={styles.input}
//                       >
//                         <option value="ACTIVE">Active</option>
//                         <option value="OUT_OF_SERVICE">Out of Service</option>
//                       </Form.Select>
//                     </Form.Group>
//                   </Col>

//                   <Col md={6}>
//                     <Form.Group controlId="availableFrom">
//                       <Form.Label>Available From</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="availableFrom"
//                         value={formData.availableFrom}
//                         onChange={handleChange}
//                         placeholder="e.g., 09:00"
//                         className={fieldErrors.availableFrom ? 'is-invalid' : ''}
//                         style={styles.input}
//                       />
//                       {fieldErrors.availableFrom && (
//                         <Form.Text className="text-danger">{fieldErrors.availableFrom}</Form.Text>
//                       )}
//                     </Form.Group>
//                   </Col>

//                   <Col md={6}>
//                     <Form.Group controlId="availableTo">
//                       <Form.Label>Available To</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="availableTo"
//                         value={formData.availableTo}
//                         onChange={handleChange}
//                         placeholder="e.g., 17:00"
//                         className={fieldErrors.availableTo ? 'is-invalid' : ''}
//                         style={styles.input}
//                       />
//                       {fieldErrors.availableTo && (
//                         <Form.Text className="text-danger">{fieldErrors.availableTo}</Form.Text>
//                       )}
//                     </Form.Group>
//                   </Col>

//                   <Col md={12}>
//                     <Form.Group controlId="description">
//                       <Form.Label>Description</Form.Label>
//                       <Form.Control
//                         as="textarea"
//                         rows={4}
//                         name="description"
//                         value={formData.description}
//                         onChange={handleChange}
//                         placeholder="Enter a detailed description of the resource..."
//                         className={fieldErrors.description ? 'is-invalid' : ''}
//                         style={styles.textarea}
//                       />
//                       {fieldErrors.description && (
//                         <Form.Text className="text-danger">{fieldErrors.description}</Form.Text>
//                       )}
//                     </Form.Group>
//                   </Col>
//                 </Row>

//                 <div style={styles.actionRow}>
//                   <Button
//                     type="submit"
//                     variant="primary"
//                     disabled={loading}
//                     style={styles.submitButton}
//                   >
//                     {loading ? (
//                       <>
//                         <span
//                           className="spinner-border spinner-border-sm me-2"
//                           role="status"
//                           aria-hidden="true"
//                         ></span>
//                         Creating...
//                       </>
//                     ) : (
//                       'Create Resource'
//                     )}
//                   </Button>

//                   <Button
//                     type="button"
//                     variant="outline-secondary"
//                     onClick={() => navigate('/admin/resources')}
//                     style={styles.cancelButton}
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//               </Form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </AdminLayout>
//   );
// };

// export default AddResourceAdmin;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import resourceApi from '../../api/resourceApi';
import AdminLayout from '../../components/admin/AdminLayout';

const styles = {
  page: {
    minHeight: '100vh',
    padding: '24px',
    backgroundColor: '#f8f9fa',
    marginLeft: '-250px',
    width: 'calc(100% + 250px)'
  },
  contentWrapper: {
    width: '100%',
    margin: 0
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    marginBottom: '24px'
  },
  title: {
    margin: 0,
    fontSize: '2.2rem',
    fontWeight: '700',
    color: '#0f172a'
  },
  backButton: {
    padding: '12px 22px',
    fontWeight: '600',
    borderRadius: '10px'
  },
  card: {
    width: '100%',
    border: 'none',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
    backgroundColor: '#fff'
  },
  cardHeader: {
    padding: '28px 32px 18px',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#ffffff'
  },
  cardTitle: {
    margin: 0,
    fontSize: '2rem',
    fontWeight: '700',
    color: '#111827'
  },
  cardSubtitle: {
    marginTop: '10px',
    marginBottom: 0,
    color: '#6b7280',
    fontSize: '1rem'
  },
  cardBody: {
    padding: '28px 32px 32px'
  },
  input: {
    minHeight: '52px',
    borderRadius: '10px'
  },
  textarea: {
    borderRadius: '10px'
  },
  actionRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    marginTop: '28px'
  },
  submitButton: {
    minWidth: '160px',
    padding: '12px 20px',
    fontWeight: '600',
    borderRadius: '10px'
  },
  cancelButton: {
    minWidth: '120px',
    padding: '12px 20px',
    fontWeight: '600',
    borderRadius: '10px'
  }
};

const AddResourceAdmin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    type: 'LECTURE_HALL',
    capacity: '',
    location: '',
    status: 'ACTIVE',
    availableFrom: '',
    availableTo: '',
    description: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const validateField = (name, value, updatedFormData) => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

    switch (name) {
      case 'name':
        if (!value.trim()) {
          return 'Resource name is required';
        }
        if (value.trim().length < 3) {
          return 'Resource name must be at least 3 characters long';
        }
        if (value.trim().length > 100) {
          return 'Resource name must not exceed 100 characters';
        }
        return '';

      case 'capacity':
        if (!value) {
          return 'Capacity is required';
        }
        if (isNaN(value) || parseInt(value, 10) < 1) {
          return 'Capacity must be a positive number';
        }
        if (parseInt(value, 10) > 1000) {
          return 'Capacity must not exceed 1000';
        }
        return '';

      case 'location':
        if (!value.trim()) {
          return 'Location is required';
        }
        if (value.trim().length < 3) {
          return 'Location must be at least 3 characters long';
        }
        if (value.trim().length > 200) {
          return 'Location must not exceed 200 characters';
        }
        return '';

      case 'availableFrom':
        if (value && !timeRegex.test(value)) {
          return 'Available From must be in HH:MM format (e.g., 09:00)';
        }
        if (
          value &&
          updatedFormData.availableTo &&
          timeRegex.test(value) &&
          timeRegex.test(updatedFormData.availableTo)
        ) {
          const [fromHour, fromMinute] = value.split(':').map(Number);
          const [toHour, toMinute] = updatedFormData.availableTo.split(':').map(Number);

          const fromMinutes = fromHour * 60 + fromMinute;
          const toMinutes = toHour * 60 + toMinute;

          if (fromMinutes >= toMinutes) {
            return '';
          }
        }
        return '';

      case 'availableTo':
        if (value && !timeRegex.test(value)) {
          return 'Available To must be in HH:MM format (e.g., 17:00)';
        }
        if (
          updatedFormData.availableFrom &&
          value &&
          timeRegex.test(updatedFormData.availableFrom) &&
          timeRegex.test(value)
        ) {
          const [fromHour, fromMinute] = updatedFormData.availableFrom.split(':').map(Number);
          const [toHour, toMinute] = value.split(':').map(Number);

          const fromMinutes = fromHour * 60 + fromMinute;
          const toMinutes = toHour * 60 + toMinute;

          if (fromMinutes >= toMinutes) {
            return 'Available To must be later than Available From';
          }
        }
        return '';

      case 'description':
        if (value && value.length > 500) {
          return 'Description must not exceed 500 characters';
        }
        return '';

      default:
        return '';
    }
  };

  const validateForm = () => {
    const errors = {};
    const fieldsToValidate = [
      'name',
      'capacity',
      'location',
      'availableFrom',
      'availableTo',
      'description'
    ];

    fieldsToValidate.forEach((field) => {
      const errorMessage = validateField(field, formData[field], formData);
      if (errorMessage) {
        errors[field] = errorMessage;
      }
    });

    // Extra cross-field time validation
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (
      formData.availableFrom &&
      formData.availableTo &&
      timeRegex.test(formData.availableFrom) &&
      timeRegex.test(formData.availableTo)
    ) {
      const [fromHour, fromMinute] = formData.availableFrom.split(':').map(Number);
      const [toHour, toMinute] = formData.availableTo.split(':').map(Number);

      const fromMinutes = fromHour * 60 + fromMinute;
      const toMinutes = toHour * 60 + toMinute;

      if (fromMinutes >= toMinutes) {
        errors.availableTo = 'Available To must be later than Available From';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedFormData = {
      ...formData,
      [name]: value
    };

    setFormData(updatedFormData);

    setFieldErrors((prev) => {
      const newErrors = { ...prev };

      const currentFieldError = validateField(name, value, updatedFormData);
      if (currentFieldError) {
        newErrors[name] = currentFieldError;
      } else {
        delete newErrors[name];
      }

      // Live cross-field validation for time fields
      if (name === 'availableFrom' || name === 'availableTo') {
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

        if (
          updatedFormData.availableFrom &&
          updatedFormData.availableTo &&
          timeRegex.test(updatedFormData.availableFrom) &&
          timeRegex.test(updatedFormData.availableTo)
        ) {
          const [fromHour, fromMinute] = updatedFormData.availableFrom.split(':').map(Number);
          const [toHour, toMinute] = updatedFormData.availableTo.split(':').map(Number);

          const fromMinutes = fromHour * 60 + fromMinute;
          const toMinutes = toHour * 60 + toMinute;

          if (fromMinutes >= toMinutes) {
            newErrors.availableTo = 'Available To must be later than Available From';
          } else {
            if (
              newErrors.availableTo === 'Available To must be later than Available From'
            ) {
              delete newErrors.availableTo;
            }
          }
        } else {
          if (
            newErrors.availableTo === 'Available To must be later than Available From'
          ) {
            delete newErrors.availableTo;
          }
        }
      }

      return newErrors;
    });

    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      setError('Please fix the validation errors before submitting.');
      return;
    }

    setLoading(true);

    try {
      const resourceData = {
        ...formData,
        capacity: parseInt(formData.capacity, 10)
      };

      await resourceApi.createResource(resourceData);
      navigate('/admin/resources');
    } catch (err) {
      setError('Failed to create resource. Please check your input and try again.');
      console.error('Error creating resource:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div style={styles.page}>
        <div style={styles.contentWrapper}>
          <div style={styles.topBar}>
            <h1 style={styles.title}>Add New Resource</h1>

            <Button
              variant="secondary"
              style={styles.backButton}
              onClick={() => navigate('/admin/resources')}
            >
              Back to Resources
            </Button>
          </div>

          <div className="card" style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Resource Information</h2>
              <p style={styles.cardSubtitle}>
                Fill in the details below to add a new resource to the system
              </p>
            </div>

            <div style={styles.cardBody}>
              {error && (
                <Alert variant="danger" className="mb-4">
                  <Alert.Heading>Validation Error</Alert.Heading>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row className="g-4">
                  <Col md={6}>
                    <Form.Group controlId="name">
                      <Form.Label>Resource Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g., Lab A-401"
                        className={fieldErrors.name ? 'is-invalid' : ''}
                        style={styles.input}
                      />
                      {fieldErrors.name && (
                        <Form.Text className="text-danger">{fieldErrors.name}</Form.Text>
                      )}
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="type">
                      <Form.Label>Resource Type *</Form.Label>
                      <Form.Select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        style={styles.input}
                      >
                        <option value="LECTURE_HALL">Lecture Hall</option>
                        <option value="LAB">Laboratory</option>
                        <option value="MEETING_ROOM">Meeting Room</option>
                        <option value="EQUIPMENT">Equipment</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="capacity">
                      <Form.Label>Capacity *</Form.Label>
                      <Form.Control
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                        placeholder="e.g., 50"
                        min="1"
                        className={fieldErrors.capacity ? 'is-invalid' : ''}
                        style={styles.input}
                      />
                      {fieldErrors.capacity && (
                        <Form.Text className="text-danger">{fieldErrors.capacity}</Form.Text>
                      )}
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="location">
                      <Form.Label>Location *</Form.Label>
                      <Form.Control
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g., Building A, Floor 4"
                        className={fieldErrors.location ? 'is-invalid' : ''}
                        style={styles.input}
                      />
                      {fieldErrors.location && (
                        <Form.Text className="text-danger">{fieldErrors.location}</Form.Text>
                      )}
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="status">
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        style={styles.input}
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="OUT_OF_SERVICE">Out of Service</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="availableFrom">
                      <Form.Label>Available From</Form.Label>
                      <Form.Control
                        type="text"
                        name="availableFrom"
                        value={formData.availableFrom}
                        onChange={handleChange}
                        placeholder="e.g., 09:00"
                        className={fieldErrors.availableFrom ? 'is-invalid' : ''}
                        style={styles.input}
                      />
                      {fieldErrors.availableFrom && (
                        <Form.Text className="text-danger">{fieldErrors.availableFrom}</Form.Text>
                      )}
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="availableTo">
                      <Form.Label>Available To</Form.Label>
                      <Form.Control
                        type="text"
                        name="availableTo"
                        value={formData.availableTo}
                        onChange={handleChange}
                        placeholder="e.g., 17:00"
                        className={fieldErrors.availableTo ? 'is-invalid' : ''}
                        style={styles.input}
                      />
                      {fieldErrors.availableTo && (
                        <Form.Text className="text-danger">{fieldErrors.availableTo}</Form.Text>
                      )}
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group controlId="description">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter a detailed description of the resource..."
                        className={fieldErrors.description ? 'is-invalid' : ''}
                        style={styles.textarea}
                      />
                      {fieldErrors.description && (
                        <Form.Text className="text-danger">{fieldErrors.description}</Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <div style={styles.actionRow}>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                    style={styles.submitButton}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Creating...
                      </>
                    ) : (
                      'Create Resource'
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={() => navigate('/admin/resources')}
                    style={styles.cancelButton}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddResourceAdmin;