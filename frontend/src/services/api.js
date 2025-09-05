import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'}/auth/refresh`,
            { refreshToken }
          );

          const { accessToken } = response.data.data;
          localStorage.setItem('accessToken', accessToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else if (error.message) {
      toast.error(error.message);
    } else {
      toast.error('An unexpected error occurred');
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: (refreshToken) => api.post('/auth/logout', { refreshToken }),
  getProfile: () => api.get('/auth/profile'),
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
};

// Alerts API
export const alertsAPI = {
  getAlerts: (params = {}) => api.get('/alerts', { params }),
  getAlert: (id) => api.get(`/alerts/${id}`),
  createAlert: (alertData) => api.post('/alerts', alertData),
  updateAlert: (id, alertData) => api.put(`/alerts/${id}`, alertData),
  resolveAlert: (id, resolution) => api.patch(`/alerts/${id}/resolve`, { resolution }),
  deleteAlert: (id) => api.delete(`/alerts/${id}`),
  getAlertStats: () => api.get('/alerts/stats'),
};

// Domains API
export const domainsAPI = {
  getSuspiciousDomains: (params = {}) => api.get('/domains', { params }),
  getDomain: (id) => api.get(`/domains/${id}`),
  checkDomain: (domain) => api.post('/domains/check', { domain }),
  addSuspiciousDomain: (domainData) => api.post('/domains', domainData),
  updateDomain: (id, domainData) => api.put(`/domains/${id}`, domainData),
  deleteDomain: (id) => api.delete(`/domains/${id}`),
  getDomainStats: () => api.get('/domains/stats'),
};

// OSINT API
export const osintAPI = {
  triggerFetch: () => api.post('/osint/fetch'),
  getFetchStatus: () => api.get('/osint/status'),
  getSources: () => api.get('/osint/sources'),
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;
