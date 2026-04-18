import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const userApi = {
  getAllUsers: async () => {
    const response = await axios.get(`${API_BASE_URL}/auth/users`);
    return response.data;
  },
};

export default userApi;
