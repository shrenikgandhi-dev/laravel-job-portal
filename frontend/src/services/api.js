import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = (data) => api.post('/register', data);
export const login = (data) => api.post('/login', data);
export const logout = () => api.post('/logout');
export const getUser = () => api.get('/user');

// Jobs
export const getJobs = () => api.get('/jobs');
export const getApprovedJobs = () => api.get('/jobs/approved');
export const getJob = (id) => api.get(`/jobs/${id}`);
export const createJob = (data) => api.post('/jobs', data);
export const updateJob = (id, data) => api.put(`/jobs/${id}`, data);
export const deleteJob = (id) => api.delete(`/jobs/${id}`);

// Applications
export const getApplications = () => api.get('/applications');
export const applyToJob = (jobId, formData) => {
  return api.post(`/jobs/${jobId}/apply`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
export const updateApplicationStatus = (id, status) => 
  api.patch(`/applications/${id}/status`, { status });

// Categories
export const getCategories = () => api.get('/categories');
export const createCategory = (data) => api.post('/categories', data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// Admin
export const getAdminJobs = () => api.get('/admin/jobs');
export const approveJob = (id) => api.patch(`/admin/jobs/${id}/approve`);
export const rejectJob = (id) => api.patch(`/admin/jobs/${id}/reject`);
export const getUsers = () => api.get('/admin/users');
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);

export default api;
