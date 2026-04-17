import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const authHeader = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

const notificationApi = {
  getMyNotifications: async (token) => {
    const response = await axios.get(`${API_BASE_URL}/notifications/me`, authHeader(token));
    return response.data;
  },

  getUnreadCount: async (token) => {
    const response = await axios.get(`${API_BASE_URL}/notifications/me/unread-count`, authHeader(token));
    return response.data;
  },

  markAllRead: async (token) => {
    await axios.patch(`${API_BASE_URL}/notifications/me/mark-all-read`, {}, authHeader(token));
  },

  getAllNotifications: async () => {
    const response = await axios.get(`${API_BASE_URL}/notifications`);
    return response.data;
  },

  deleteNotification: async (id) => {
    await axios.delete(`${API_BASE_URL}/notifications/${id}`);
  },
};

export default notificationApi;
