import api from './api';

export const auditService = {
  getAll: () => api.get('/audit'),
};
