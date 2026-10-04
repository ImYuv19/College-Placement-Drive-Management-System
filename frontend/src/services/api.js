import axios from 'axios';

/**
 * API Service
 * 
 * Central API configuration using axios.
 * All API calls go through this instance, which:
 * - Sets the base URL for all requests
 * - Automatically attaches the JWT token from localStorage
 * - Handles common error responses
 */

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://college-placement-drive-management-system.onrender.com/api'
});

/**
 * Request interceptor — automatically adds JWT token to every request.
 * The token is stored in localStorage after login.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Response interceptor — handles 401 errors globally.
 * If the server returns 401, the user is logged out.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear stored data and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if not already on a login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

// =============================================
// AUTH API
// =============================================
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

// =============================================
// COMPANIES API
// =============================================
export const companiesAPI = {
  getAll: () => api.get('/companies'),
  create: (data) => api.post('/companies', data),
};

// =============================================
// DRIVES API
// =============================================
export const drivesAPI = {
  getAll: (params) => api.get('/drives', { params }),
  getById: (id) => api.get(`/drives/${id}`),
  create: (data) => api.post('/drives', data),
  update: (id, data) => api.put(`/drives/${id}`, data),
  delete: (id) => api.delete(`/drives/${id}`),
  apply: (driveId) => api.post(`/drives/${driveId}/apply`),
  getApplications: (driveId) => api.get(`/drives/${driveId}/applications`),
};

// =============================================
// APPLICATIONS API
// =============================================
export const applicationsAPI = {
  getMy: () => api.get('/applications/my'),
  updateStatus: (id, status) => api.put(`/applications/${id}/status`, { status }),
};

// =============================================
// MANAGEMENT API
// =============================================
export const managementAPI = {
  // Students
  getStudents: (params) => api.get('/management/students', { params }),
  getStudent: (id) => api.get(`/management/students/${id}`),
  updateStudent: (id, data) => api.put(`/management/students/${id}`, data),
  importStudents: (formData) => api.post('/management/students/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  // Batches
  getBatches: () => api.get('/management/batches'),
  createBatch: (data) => api.post('/management/batches', data),
  activateBatch: (id) => api.put(`/management/batches/${id}/activate`),

  // Officer account
  updateOfficer: (data) => api.put('/management/officer', data),

  // Management account
  updateAccount: (data) => api.put('/management/account', data),
};

export default api;
