import axios from 'axios';

// This checks if a live URL exists; otherwise, it defaults to localhost
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api', 
});

// Interceptor to attach the token to every request dynamically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle expired tokens
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('role'); // Clear other items too
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;