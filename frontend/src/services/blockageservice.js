import api from './api';

export const blockageService = {
  getAll: () => api.get('/blockages'),
  block: (data) => api.post('/blockages', data),
  unblock: (id) => api.put(`/blockages/${id}/unblock`),
  getByDate: (date) => api.get(`/blockages?date=${date}`),
  checkBlocked: async (date, trancheId) => {
    const res = await api.get(`/blockages/check?date=${date}&trancheId=${trancheId}`);
    return Boolean(res.data?.blocked);
  },
};