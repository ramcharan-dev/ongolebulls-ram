import axios from 'axios';
import { getUser } from '../utils/storage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor — attach Authorization header if user session exists
api.interceptors.request.use(
  (config) => {
    const user = getUser();
    if (user?.token) {
      config.headers['Authorization'] = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — normalize errors into a consistent shape
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Auto-logout on expired token (skip auth endpoints which return 401 for invalid credentials)
    if (
      error.response?.status === 401 &&
      !error.config?.url?.includes('/api/auth/') &&
      !error.config?.url?.includes('/api/login')
    ) {
      localStorage.removeItem('ob_user');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    let userMessage;

    if (!error.response) {
      // Network down / backend not reachable
      userMessage =
        'Unable to connect to the server. Please ensure the backend is running on port 8080.';
    } else {
      const data = error.response.data;
      userMessage =
        (typeof data === 'string' && data) ||
        data?.message ||
        data?.error ||
        `Server error (${error.response.status}). Please try again.`;
    }

    const normalized = new Error(userMessage);
    normalized.userMessage = userMessage;
    normalized.status      = error.response?.status;
    normalized.original    = error;

    return Promise.reject(normalized);
  }
);

export default api;
