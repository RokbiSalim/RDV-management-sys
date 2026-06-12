import { fallbackClients } from './containerCrudFallback.js';

export const fallbackUsers = [
  { id: 'local-admin', username: 'admin', role: 'ADMIN_PORT', clientId: null, clientName: null },
  { id: 'local-transporter-1', username: 'transporteur', role: 'RESPONSABLE_TRANSPORTEURS', clientId: 1, clientName: 'Marsa Maroc' },
  { id: 'local-transporter-2', username: 'youssef', role: 'RESPONSABLE_TRANSPORTEURS', clientId: 2, clientName: 'Port Services Maroc' },
];

export function normalizeUser(user, clients = fallbackClients) {
  const client =
    clients.find((item) => String(item.id) === String(user.clientId)) ||
    clients.find((item) => item.name === user.clientName);

  return {
    ...user,
    clientId: user.clientId ?? client?.id ?? '',
    clientName: user.clientName ?? client?.name ?? '',
  };
}

export function buildUserFromPayload(payload, clients, currentUser) {
  const client = clients.find((item) => Number(item.id) === Number(payload.clientId));
  const isTransporter = payload.role === 'RESPONSABLE_TRANSPORTEURS';

  return {
    id: currentUser?.id || `local-${Date.now()}`,
    username: payload.username,
    role: payload.role,
    clientId: isTransporter ? payload.clientId : '',
    clientName: isTransporter ? client?.name || currentUser?.clientName || '' : '',
  };
}
