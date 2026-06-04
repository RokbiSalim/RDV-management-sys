import api from './api';

export const trancheService = {
  getAll: () => api.get('/tranches'),
  getAvailability: (date) => api.get('/tranches/availability', { params: { date } }),
  getById: (id) => api.get(`/tranches/${id}`),
  create: (data) => api.post('/tranches', data),
  update: (id, data) => api.put(`/tranches/${id}`, data),
  delete: (id) => api.delete(`/tranches/${id}`),
};