import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
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

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle global API errors (e.g. 401 Unauthorized, 500 Server Error)
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        // Handle token expiration or unauthorized access
        localStorage.removeItem('token');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
