/** Map backend enums to UI labels used in the app. */
export function normalizeStatut(statut) {
  const s = String(statut || '').toUpperCase();
  if (s === 'CREATED') return 'pending';
  if (s === 'CONFIRMED') return 'approved';
  if (s === 'CANCELLED') return 'rejected';
  return String(statut || '').toLowerCase();
}

export function roleToUi(role) {
  const r = String(role || '').toUpperCase();
  if (r === 'ADMIN_PORT') return 'ADMIN';
  if (r === 'RESPONSABLE_TRANSPORTEURS') return 'TRANSPORTER';
  return r;
}

export function roleToBackend(uiRole) {
  if (uiRole === 'ADMIN') return 'ADMIN_PORT';
  if (uiRole === 'TRANSPORTER') return 'RESPONSABLE_TRANSPORTEURS';
  return uiRole;
}
