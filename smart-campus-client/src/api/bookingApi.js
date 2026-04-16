import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const bookingApi = {
  getBookings: async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.resourceId) params.append('resourceId', filters.resourceId);
    if (filters.bookingDate) params.append('bookingDate', filters.bookingDate);
    if (filters.status) params.append('status', filters.status);

    const response = await axios.get(`${API_BASE_URL}/bookings?${params.toString()}`);
    return response.data;
  },

  getBookingById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/bookings/${id}`);
    return response.data;
  },

  createBooking: async (bookingData) => {
    const response = await axios.post(`${API_BASE_URL}/bookings`, bookingData);
    return response.data;
  },

  updateBooking: async (id, bookingData) => {
    const response = await axios.put(`${API_BASE_URL}/bookings/${id}`, bookingData);
    return response.data;
  },

  updateBookingStatus: async (id, status) => {
    const response = await axios.patch(`${API_BASE_URL}/bookings/${id}/status`, { status });
    return response.data;
  },

  issueBookingQr: async (id) => {
    const response = await axios.post(`${API_BASE_URL}/bookings/${id}/qr`);
    return response.data;
  },

  checkInBookingQr: async (token) => {
    const response = await axios.post(`${API_BASE_URL}/bookings/check-in`, { token });
    return response.data;
  },

  deleteBooking: async (id) => {
    await axios.delete(`${API_BASE_URL}/bookings/${id}`);
  },

  reviewBooking: async (id, status, rejectionReason = '') => {
    const response = await axios.patch(`${API_BASE_URL}/bookings/${id}/review`, {
      status,
      rejectionReason
    });
    return response.data;
  },

  getUserBookings: async (email) => {
    const response = await axios.get(`${API_BASE_URL}/bookings/user/${encodeURIComponent(email)}`);
    return response.data;
  }
};

export default bookingApi;
