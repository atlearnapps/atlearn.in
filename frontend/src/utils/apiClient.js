import axios from 'axios';
import { toast } from 'react-toastify';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // Handle different error scenarios
    if (response) {
      switch (response.status) {
        case 401:
          // Unauthorized - clear local storage and redirect to login
          localStorage.clear();
          window.location.href = '/login';
          break;
          
        case 403:
          toast.error('You do not have permission to perform this action');
          break;
          
        case 404:
          toast.error('Resource not found');
          break;
          
        case 422:
          // Validation errors
          const errors = response.data.errors;
          Object.keys(errors).forEach((key) => {
            toast.error(errors[key][0]);
          });
          break;
          
        case 500:
          toast.error('An unexpected error occurred. Please try again later.');
          break;
          
        default:
          toast.error('Something went wrong. Please try again.');
      }
    } else if (error.request) {
      // Network error
      toast.error('Unable to connect to the server. Please check your internet connection.');
    } else {
      toast.error('An unexpected error occurred. Please try again.');
    }
    
    return Promise.reject(error);
  }
);

export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

export default apiClient;