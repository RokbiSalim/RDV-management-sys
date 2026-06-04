import { useRole } from '../context/roleContext.jsx';
import { clearSession } from '../utils/session.js';

export default function Topbar({ title }) {
  const { role, username, setRole } = useRole();
  const userLabel = username ? `${username} (${role})` : role;

  return (
    <header className="topbar">
      <div className="topbar__left">
        <h2 className="topbar__title">{title}</h2>
        <span className="topbar__chip">{userLabel}</span>
      </div>

      <div className="topbar__right">
        <button
          className="btn btn--ghost"
          onClick={() => {
            clearSession();
            setRole(null);
            window.location.href = '/login';
          }}
        >
          Déconnexion
        </button>
      </div>
    </header>
  );
}

