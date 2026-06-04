import { Navigate } from 'react-router-dom';
import { useRole } from '../context/roleContext.jsx';





export function RequireRole({ role, children }) {
  const { role: currentRole } = useRole();
  if (!currentRole) return <Navigate to="/login" replace />;
  if (currentRole !== role) return <Navigate to="/" replace />;
  return children;
}

