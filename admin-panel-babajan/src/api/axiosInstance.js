import axios from 'axios';

// Create an Axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // Replace with your backend API URL
  timeout: 10000, // Request timeout (10 seconds)
});

// Add a request interceptor to include authorization token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access (e.g., token expiration)
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
