import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://e-commerce-backend-87to.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user')).token
      : null;
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance; 