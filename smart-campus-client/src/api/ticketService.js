import axios from 'axios';

const API_URL = 'http://localhost:8080/api/tickets';

// Get all tickets
export const getTickets = () => {
  return axios.get(API_URL);
};

// Create ticket
export const createTicket = (data) => {
  return axios.post(API_URL, data);
};

export const updateStatus = (ticketId, status) => {
  return axios.put(
    `${API_URL}/${ticketId}/status?status=${status}`
  );
};

// Upload images
export const uploadImages = (ticketId, files) => {
  const formData = new FormData();

  files.forEach(file => {
    formData.append('files', file);
  });

  return axios.post(`${API_URL}/${ticketId}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// Get comments
export const getComments = (ticketId) => {
  return axios.get(`${API_URL}/${ticketId}/comments`);
};

// Add comment
export const addComment = (ticketId, data) => {
  return axios.post(`${API_URL}/${ticketId}/comments`, data);
};
