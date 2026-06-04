import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getSession } from '../utils/session.js';

const RoleContext = createContext(null);

export function RoleProvider({ children }) {
  const [session, setSession] = useState(() => getSession());

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'role' || e.key === 'userId' || e.key === 'username') {
        setSession(getSession());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const value = useMemo(
    () => ({
      role: session?.role ?? null,
      userId: session?.userId ?? null,
      username: session?.username ?? '',
      backendRole: session?.backendRole ?? '',
      setRole: (nextRole) => {
        if (!nextRole) {
          setSession(null);
          return;
        }
        setSession(getSession());
      },
    }),
    [session],
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

