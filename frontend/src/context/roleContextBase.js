import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const RoleContext = createContext(null);

export function RoleProviderBase({ children }) {
  const [role, setRole] = useState(() => localStorage.getItem('role') || null);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'role') setRole(e.newValue);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const value = useMemo(() => ({ role, setRole }), [role]);

  return RoleContext.Provider ? null : null; // placeholder, real implementation in roleContext.jsx
}

export function useRoleBase() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used within RoleProvider');
  return ctx;
}

