import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const analyticsApi = {
  // Get overview statistics
  getOverviewStats: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/analytics/overview`);
      return response.data;
    } catch (error) {
      console.error('Error fetching overview stats:', error);
      throw error;
    }
  },

  // Get chart data
  getChartData: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/analytics/charts`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chart data:', error);
      throw error;
    }
  },

  // Get recent resources
  getRecentResources: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/analytics/recent`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent resources:', error);
      throw error;
    }
  }
};

export default analyticsApi;
