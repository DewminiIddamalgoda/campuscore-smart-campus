import axios from 'axios';

const API_URL = 'http://localhost:8080/api/tickets';

// Get ALL tickets (admin use)
export const getTickets = () => {
  return axios.get(API_URL);
};

// Get ONLY logged user's tickets
export const getMyTickets = () => {
  return axios.get(`${API_URL}/my`);
};

// Create ticket
export const createTicket = (data) => {
  return axios.post(API_URL, data);
};

// Update status
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

// Update comment
export const updateComment = (ticketId, commentId, message) => {
  return axios.put(
    `${API_URL}/${ticketId}/comments/${commentId}?message=${message}`
  );
};

// Delete comment
export const deleteComment = (ticketId, commentId) => {
  return axios.delete(
    `${API_URL}/${ticketId}/comments/${commentId}`
  );
};

export const assignTechnician = (ticketId, technicianId) => {
  return axios.put(
    `${API_URL}/${ticketId}/assign?technicianId=${technicianId}`
  );
};