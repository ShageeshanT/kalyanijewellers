import axios from 'axios';

// Base URL from environment variable or default to backend port
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://kalyanibackend-production.up.railway.app';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (token) {
      // Clean the token by removing any extra quotes
      const cleanToken = token.replace(/^"|"$/g, '');
      config.headers.Authorization = `Bearer ${cleanToken}`;
      console.log('Adding token to request:', cleanToken.substring(0, 20) + '...');
    } else {
      console.log('No token found in localStorage');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - clear token and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      // Optionally redirect to login page
      // window.location.href = '/user/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

