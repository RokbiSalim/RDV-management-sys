import { Navigate } from 'react-router-dom';
import { getSession } from '../utils/session.js';

export default function HomeRedirect() {
  const session = getSession();
  if (!session?.role) return <Navigate to="/login" replace />;
  return (
    <Navigate
      to={session.role === 'ADMIN' ? '/admin/dashboard' : '/transporter/dashboard'}
      replace
    />
  );
}
