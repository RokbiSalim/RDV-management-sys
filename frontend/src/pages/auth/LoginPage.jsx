import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { userService } from '../../services/userservice.js';
import { roleToBackend, roleToUi } from '../../utils/backendMaps.js';
import { getSession, saveSession } from '../../utils/session.js';

export default function LoginPage() {
  const session = useMemo(() => getSession(), []);
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState('ADMIN');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);

  const loadUsers = () => {
    setLoading(true);
    return userService
      .getAll()
      .then((res) => {
        const list = res.data || [];
        setUsers(list);
        setError(null);
        return list;
      })
      .catch((err) => {
        setError(err.message || 'Impossible de joindre le backend.');
        return [];
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const usersForRole = useMemo(
    () => users.filter((u) => roleToUi(u.role) === role),
    [users, role],
  );

  const selectedUser = usersForRole[0] ?? null;

  if (session?.role) {
    const dest = session.role === 'ADMIN' ? '/admin/dashboard' : '/transporter/dashboard';
    return <Navigate to={dest} replace />;
  }

  const loginAs = (user) => {
    if (!user) return;
    const uiRole = roleToUi(user.role);
    saveSession({
      role: uiRole,
      userId: user.id,
      username: user.username,
      backendRole: user.role,
    });
    window.location.href = uiRole === 'ADMIN' ? '/admin/dashboard' : '/transporter/dashboard';
  };

  const createDemoUser = async () => {
    setCreating(true);
    try {
      await userService.create({
        username: role === 'ADMIN' ? 'admin' : 'transporteur',
        role: roleToBackend(role),
      });
      const list = await loadUsers();
      const created = list.find((u) => roleToUi(u.role) === role);
      if (created) loginAs(created);
    } catch (err) {
      setError(err.message || 'Impossible de créer l\'utilisateur.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <section className="authPage">
      <section className="authCard">
        <section className="authHeader">
          <section className="authLogo">📦</section>
          <section>
            <h1 className="authTitle">Container Appointment Manager</h1>
            <p className="authSubtitle">Choisissez votre rôle pour vous connecter.</p>
          </section>
        </section>

        {error ? <p className="callout callout--danger">{error}</p> : null}

        <section className="field">
          <label className="label">Rôle</label>
          <section className="rolePick">
            <button
              type="button"
              className={role === 'ADMIN' ? 'rolePick__btn rolePick__btn--active' : 'rolePick__btn'}
              onClick={() => setRole('ADMIN')}
            >
              Admin
            </button>
            <button
              type="button"
              className={role === 'TRANSPORTER' ? 'rolePick__btn rolePick__btn--active' : 'rolePick__btn'}
              onClick={() => setRole('TRANSPORTER')}
            >
              Transporteur
            </button>
          </section>
        </section>

        {loading ? (
          <p className="muted">Chargement…</p>
        ) : selectedUser ? (
          <p className="muted" style={{ marginBottom: 12 }}>
            Compte : <strong>{selectedUser.username}</strong>
          </p>
        ) : (
          <p className="muted" style={{ marginBottom: 12 }}>
            Aucun compte {role === 'ADMIN' ? 'admin' : 'transporteur'} en base.
          </p>
        )}

        <button
          type="button"
          className="btn btn--primary authBtn"
          onClick={() => loginAs(selectedUser)}
          disabled={loading || !selectedUser}
        >
          Se connecter en {role === 'ADMIN' ? 'Admin' : 'Transporteur'}
        </button>

        {!loading && !selectedUser ? (
          <button
            type="button"
            className="btn btn--ghost authBtn"
            style={{ marginTop: 8 }}
            onClick={createDemoUser}
            disabled={creating}
          >
            {creating ? 'Création…' : `Créer le compte ${role === 'ADMIN' ? 'admin' : 'transporteur'}`}
          </button>
        ) : null}
      </section>
    </section>
  );
}
