import api from './api';

export const containerService = {
  getAll: () => api.get('/containers'),
  create: (data) => api.post('/containers', data),
};
