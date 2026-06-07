import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { clearSession, getSession, saveSession } from '../utils/session.js';
import { initKeycloak, getKeycloakProfile } from '../services/keycloakservice.js';
import { userService } from '../services/userservice.js';
import { roleToUi } from '../utils/backendMaps.js';

const RoleContext = createContext(null);

export function RoleProvider({ children }) {
  const [session, setSession] = useState(() => getSession());
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'role' || e.key === 'userId' || e.key === 'username') {
        setSession(getSession());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadKeycloakSession() {
      try {
        const authenticated = await initKeycloak();
        if (!authenticated) {
          clearSession();
          if (!cancelled) setSession(null);
          return;
        }

        const profile = getKeycloakProfile();
        if (!profile.appRole) {
          clearSession();
          if (!cancelled) setSession(null);
          return;
        }

        let appUser = null;
        try {
          const response = await userService.getAll();
          appUser = (response.data || []).find((user) => user.username === profile.username);
        } catch {
          appUser = null;
        }

        const nextSession = {
          role: appUser ? roleToUi(appUser.role) : profile.appRole,
          userId: appUser?.id || profile.subject,
          username: profile.username,
          backendRole: appUser?.role || profile.appRole,
        };

        saveSession(nextSession);
        if (!cancelled) setSession(nextSession);
      } catch {
        clearSession();
        if (!cancelled) setSession(null);
      } finally {
        if (!cancelled) setAuthReady(true);
      }
    }

    loadKeycloakSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      role: session?.role ?? null,
      userId: session?.userId ?? null,
      username: session?.username ?? '',
      backendRole: session?.backendRole ?? '',
      authReady,
      setRole: (nextRole) => {
        if (!nextRole) {
          setSession(null);
          return;
        }
        setSession(getSession());
      },
    }),
    [session, authReady],
  );

  return (
    <RoleContext.Provider value={value}>{children}</RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used within RoleProvider');
  return ctx;
}

