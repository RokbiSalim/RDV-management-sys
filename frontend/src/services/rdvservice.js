import api from './api';

export const rdvService = {
  getAll: () => api.get('/rdvs'),
  create: (data) => api.post('/rdvs', data),
  update: (id, data) => api.put(`/rdvs/${id}`, data),
  confirm: (id) => api.put(`/rdvs/${id}/confirm`),
  cancel: (id) => api.put(`/rdvs/${id}/cancel`),
  delete: (id) => api.delete(`/rdvs/${id}`),
};