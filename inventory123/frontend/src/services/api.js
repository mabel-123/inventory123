import axios from 'axios';

// Create axios instance with base configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token failed, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: (credentials) => api.post('/token/', credentials),
  refreshToken: (refresh) => api.post('/token/refresh/', { refresh }),
  verifyToken: (token) => api.post('/token/verify/', { token }),
};

// Products API
export const productsAPI = {
  getAll: (params) => api.get('/products/', { params }),
  getById: (id) => api.get(`/products/${id}/`),
  create: (data) => api.post('/products/', data),
  update: (id, data) => api.put(`/products/${id}/`, data),
  delete: (id) => api.delete(`/products/${id}/`),
  uploadImage: (id, imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    return api.patch(`/products/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Categories API
export const categoriesAPI = {
  getAll: (params) => api.get('/categories/', { params }),
  getById: (id) => api.get(`/categories/${id}/`),
  create: (data) => api.post('/categories/', data),
  update: (id, data) => api.put(`/categories/${id}/`, data),
  delete: (id) => api.delete(`/categories/${id}/`),
};

// Suppliers API
export const suppliersAPI = {
  getAll: (params) => api.get('/suppliers/', { params }),
  getById: (id) => api.get(`/suppliers/${id}/`),
  create: (data) => api.post('/suppliers/', data),
  update: (id, data) => api.put(`/suppliers/${id}/`, data),
  delete: (id) => api.delete(`/suppliers/${id}/`),
};

// Sales API
export const salesAPI = {
  getAll: (params) => api.get('/sales/', { params }),
  getById: (id) => api.get(`/sales/${id}/`),
  create: (data) => api.post('/sales/', data),
  update: (id, data) => api.put(`/sales/${id}/`, data),
  delete: (id) => api.delete(`/sales/${id}/`),
};

// Stock Movements API
export const stockMovementsAPI = {
  getAll: (params) => api.get('/stock-movements/', { params }),
  getById: (id) => api.get(`/stock-movements/${id}/`),
  create: (data) => api.post('/stock-movements/', data),
  update: (id, data) => api.put(`/stock-movements/${id}/`, data),
  delete: (id) => api.delete(`/stock-movements/${id}/`),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/'),
  getAnalytics: (params) => api.get('/dashboard/analytics/', { params }),
};

// Utility functions
export const apiUtils = {
  // Handle API errors
  handleError: (error) => {
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data?.detail || error.response.data?.message || 'An error occurred',
        status: error.response.status,
        data: error.response.data,
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        message: 'No response from server. Please check your connection.',
        status: 0,
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'An unexpected error occurred',
        status: 0,
      };
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },

  // Clear all auth data
  clearAuth: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  // Get auth token
  getToken: () => {
    return localStorage.getItem('access_token');
  },
};

export default api; 