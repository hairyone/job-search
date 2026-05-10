import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const api = {
  // Jobs
  getJobs: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.source) params.append('source', filters.source);
    if (filters.search) params.append('search', filters.search);
    
    const response = await axios.get(`${API_URL}/jobs?${params}`);
    return response.data;
  },

  getJob: async (id) => {
    const response = await axios.get(`${API_URL}/jobs/${id}`);
    return response.data;
  },

  createJob: async (jobData) => {
    const response = await axios.post(`${API_URL}/jobs`, jobData);
    return response.data;
  },

  updateJob: async (id, jobData) => {
    const response = await axios.put(`${API_URL}/jobs/${id}`, jobData);
    return response.data;
  },

  deleteJob: async (id) => {
    const response = await axios.delete(`${API_URL}/jobs/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await axios.get(`${API_URL}/jobs/stats/summary`);
    return response.data;
  },

  // Attachments
  getAttachments: async (jobId) => {
    const response = await axios.get(`${API_URL}/attachments/job/${jobId}`);
    return response.data;
  },

  createAttachment: async (attachmentData) => {
    const response = await axios.post(`${API_URL}/attachments`, attachmentData);
    return response.data;
  },

  deleteAttachment: async (id) => {
    const response = await axios.delete(`${API_URL}/attachments/${id}`);
    return response.data;
  },

  // Contacts
  createContact: async (jobId, contactData) => {
    const response = await axios.post(`${API_URL}/jobs/${jobId}/contacts`, contactData);
    return response.data;
  },

  updateContact: async (contactId, contactData) => {
    const response = await axios.put(`${API_URL}/jobs/contacts/${contactId}`, contactData);
    return response.data;
  },

  deleteContact: async (contactId) => {
    const response = await axios.delete(`${API_URL}/jobs/contacts/${contactId}`);
    return response.data;
  }
};

export default api;
