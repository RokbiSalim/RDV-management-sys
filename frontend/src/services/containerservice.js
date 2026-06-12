import api from './api';

export const containerService = {
  getAll: () => api.get('/containers'),
  create: (data) => api.post('/containers', data),
  update: (id, data) => api.put(`/containers/${id}`, data),
  delete: (id) => api.delete(`/containers/${id}`),
};
