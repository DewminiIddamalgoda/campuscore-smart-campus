import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const authApi = {
  login: async (payload) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, payload);
    return response.data;
  },

  registerStudent: async (payload) => {
    const response = await axios.post(`${API_BASE_URL}/auth/register/student`, payload);
    return response.data;
  },

  registerAdmin: async (payload) => {
    const response = await axios.post(`${API_BASE_URL}/auth/register/admin`, payload);
    return response.data;
  },

  registerTechnician: async (payload) => {
    const response = await axios.post(`${API_BASE_URL}/auth/register/technician`, payload);
    return response.data;
  },
};

export default authApi;
