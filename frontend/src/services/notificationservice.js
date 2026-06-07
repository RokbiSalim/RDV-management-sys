import api from './api.js';

export const notificationService = {
  sendWhatsApp(payload) {
    return api.post('/notifications/whatsapp', payload);
  },
};
