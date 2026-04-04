// src/api/axios.js
import axios from 'axios';

// Change this one line when deploying to production
const BASE_URL = 'https://ocym-backend.onrender.com';

const api = axios.create({ baseURL: BASE_URL });

// Auto-attach JWT token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
