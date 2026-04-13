import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const resourceApi = {
  getAllResources: async () => {
    try {
      console.log('Fetching all resources...');
      const response = await axios.get(`${API_BASE_URL}/resources`);
      console.log('Resources fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching all resources:', error);
      throw error;
    }
  },

  getResourceById: async (id) => {
    try {
      console.log('Fetching resource by ID:', id);
      const response = await axios.get(`${API_BASE_URL}/resources/${id}`);
      console.log('Resource fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching resource by ID:', error);
      throw error;
    }
  },

  createResource: async (resourceData) => {
    try {
      console.log('Creating resource:', resourceData);
      const response = await axios.post(`${API_BASE_URL}/resources`, resourceData);
      console.log('Resource created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating resource:', error);
      throw error;
    }
  },

  updateResource: async (id, resourceData) => {
    try {
      console.log('Updating resource:', id, resourceData);
      const response = await axios.put(`${API_BASE_URL}/resources/${id}`, resourceData);
      console.log('Resource updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating resource:', error);
      throw error;
    }
  },

  deleteResource: async (id) => {
    try {
      console.log('Deleting resource:', id);
      await axios.delete(`${API_BASE_URL}/resources/${id}`);
      console.log('Resource deleted successfully');
    } catch (error) {
      console.error('Error deleting resource:', error);
      throw error;
    }
  },

  searchResources: async (filters) => {
    try {
      console.log('Searching resources with filters:', filters);
      const params = new URLSearchParams();
      
      if (filters.type) params.append('type', filters.type);
      if (filters.location) params.append('location', filters.location);
      if (filters.minCapacity) params.append('minCapacity', filters.minCapacity);
      if (filters.status) params.append('status', filters.status);
      
      const response = await axios.get(`${API_BASE_URL}/resources/search?${params}`);
      console.log('Resources searched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error searching resources:', error);
      throw error;
    }
  }
};

export default resourceApi;
