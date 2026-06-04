// Simple static auth service — no backend. Replace with real API later.
// NOTE: this file is not used by the current role-based mock UI.

const STATIC_USERS = [
  { username: 'admin', password: 'admin123', name: 'Admin User', email: 'admin@rdv.com' },
  { username: 'user', password: 'userpass', name: 'Regular User', email: 'user@rdv.com' },
];

// Unused by the current PFE mock UI, kept to avoid breaking legacy imports.


export async function authenticate(username, password) {
  const found = STATIC_USERS.find((u) => u.username === username && u.password === password);
  if (!found) return null;

  // create a fake token (base64 of username:timestamp)
  const token = window.btoa(`${found.username}:${Date.now()}`);
  return { token, user: { username: found.username, name: found.name, email: found.email } };
}

export function getUserFromToken(token) {
  if (!token) return null;
  try {
    const decoded = window.atob(token);
    const username = decoded.split(':')[0];
    const found = STATIC_USERS.find((u) => u.username === username);
    if (!found) return null;
    return { username: found.username, name: found.name, email: found.email };
  } catch {
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem('auth_token');
}

