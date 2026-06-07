import axios from 'axios';
import { getKeycloakToken } from './keycloakservice.js';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await getKeycloakToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data;
    const message =
      (typeof data === 'string' && data) ||
      data?.message ||
      data?.error ||
      (data && typeof data === 'object' && Object.values(data).find((v) => typeof v === 'string')) ||
      (Array.isArray(data?.errors) ? data.errors.map((e) => e.defaultMessage || e.message).join(', ') : null) ||
      error.message ||
      'Request failed';
    return Promise.reject(new Error(message));
  },
);

export default api;
