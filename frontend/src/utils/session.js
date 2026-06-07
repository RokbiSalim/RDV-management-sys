const KEYS = {
  role: 'role',
  userId: 'userId',
  username: 'username',
  backendRole: 'backendRole',
};

export function saveSession({ role, userId, username, backendRole }) {
  localStorage.setItem(KEYS.role, role);
  localStorage.setItem(KEYS.userId, userId == null ? '' : String(userId));
  localStorage.setItem(KEYS.username, username);
  localStorage.setItem(KEYS.backendRole, backendRole);
}

export function clearSession() {
  Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
}

export function getSession() {
  const role = localStorage.getItem(KEYS.role);
  if (!role) return null;
  return {
    role,
    userId: localStorage.getItem(KEYS.userId) || null,
    username: localStorage.getItem(KEYS.username) || '',
    backendRole: localStorage.getItem(KEYS.backendRole) || '',
  };
}

export function getCurrentUserId() {
  const id = Number(localStorage.getItem(KEYS.userId));
  return Number.isFinite(id) && id > 0 ? id : null;
}
