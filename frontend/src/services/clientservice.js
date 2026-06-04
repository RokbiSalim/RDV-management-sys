import api from './api';

export const clientService = {
  getAll: () => api.get('/clients'),
  create: (data) => api.post('/clients', data),
  delete: (id) => api.delete(`/clients/${id}`),
};