import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8082',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'rdv-realm',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'rdv-backend',
});

let initPromise;

function withTimeout(promise, timeoutMs) {
  return Promise.race([
    promise,
    new Promise((resolve) => {
      window.setTimeout(() => resolve(false), timeoutMs);
    }),
  ]);
}

export function initKeycloak() {
  if (!initPromise) {
    initPromise = withTimeout(
      keycloak.init({
        onLoad: 'check-sso',
        pkceMethod: 'S256',
        checkLoginIframe: false,
        silentCheckSsoFallback: false,
      }),
      8000,
    );
  }
  return initPromise;
}

export function loginWithKeycloak() {
  return keycloak.login({
    redirectUri: window.location.origin,
  });
}

export function logoutFromKeycloak() {
  return keycloak.logout({
    redirectUri: `${window.location.origin}/login`,
  });
}

export async function getKeycloakToken() {
  if (!keycloak.authenticated) {
    return null;
  }
  await keycloak.updateToken(30);
  return keycloak.token;
}

export function getKeycloakProfile() {
  const token = keycloak.tokenParsed || {};
  const roles = token.realm_access?.roles || [];

  return {
    authenticated: Boolean(keycloak.authenticated),
    subject: token.sub || '',
    username: token.preferred_username || token.name || '',
    email: token.email || '',
    roles,
    appRole: roles.includes('ADMIN') ? 'ADMIN' : roles.includes('TRANSPORTER') ? 'TRANSPORTER' : null,
  };
}

export default keycloak;
