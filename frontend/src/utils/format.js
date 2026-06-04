import { normalizeStatut } from './backendMaps.js';

export function formatDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function statusLabel(status) {
  const s = normalizeStatut(status);
  if (s === 'pending' || s === 'created') return { text: 'En attente', className: 'pill pill--warning' };
  if (s === 'approved' || s === 'confirmed') return { text: 'Approuvé', className: 'pill pill--success' };
  if (s === 'rejected' || s === 'cancelled') return { text: 'Refusé', className: 'pill pill--danger' };
  return { text: status, className: 'pill' };
}

export function containerAvailabilityLabel(availability) {
  const a = String(availability || '').toLowerCase();
  if (a === 'available') return { text: 'Available', className: 'pill pill--success' };
  if (a === 'reserved') return { text: 'Reserved', className: 'pill pill--warning' };
  if (a === 'unavailable') return { text: 'Unavailable', className: 'pill pill--danger' };
  return { text: availability, className: 'pill' };
}

