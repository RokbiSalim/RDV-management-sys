import { useEffect, useState } from 'react';
import { userService } from '../../services/userservice.js';
import { roleToBackend, roleToUi } from '../../utils/backendMaps.js';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUsername, setNewUsername] = useState('');
  const [newRole, setNewRole] = useState('TRANSPORTER');
  const [saving, setSaving] = useState(false);

  const loadUsers = () => {
    setLoading(true);
    return userService
      .getAll()
      .then((res) => {
        setUsers(res.data || []);
        setError(null);
      })
      .catch((err) => setError(err.message || 'Unable to load users.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async () => {
    if (!newUsername.trim()) return;
    setSaving(true);
    try {
      await userService.create({
        username: newUsername.trim(),
        role: roleToBackend(newRole),
      });
      setNewUsername('');
      await loadUsers();
    } catch (err) {
      setError(err.message || 'Unable to create user.');
    } finally {
      setSaving(false);
    }
  };

  const adminCount = users.filter((u) => roleToUi(u.role) === 'ADMIN').length;
  const transporterCount = users.filter((u) => roleToUi(u.role) === 'TRANSPORTER').length;

  if (loading) {
    return <p>Loading users...</p>;
  }

  return (
  <>
      <h1 className="pageTitle">Users</h1>
      {error ? <p className="callout callout--danger">{error}</p> : null}

      <section className="card" style={{ marginBottom: 16 }}>
        <h2 className="card__title">Nouvel utilisateur</h2>
        <input
          className="input"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          placeholder="Nom d'utilisateur"
        />
        <select className="input" style={{ marginTop: 8 }} value={newRole} onChange={(e) => setNewRole(e.target.value)}>
          <option value="ADMIN">Admin</option>
          <option value="TRANSPORTER">Transporteur</option>
        </select>
        <button
          type="button"
          className="btn btn--primary"
          style={{ marginTop: 12 }}
          onClick={handleCreateUser}
          disabled={saving || !newUsername.trim()}
        >
          {saving ? 'Création…' : 'Créer'}
        </button>
      </section>

      <section className="grid grid--3">
        <article className="card statCard">
          <p className="statCard__title">Admins</p>
          <p className="statCard__value">{adminCount}</p>
        </article>
        <article className="card statCard">
          <p className="statCard__title">Transporters</p>
          <p className="statCard__value">{transporterCount}</p>
        </article>
        <article className="card statCard">
          <p className="statCard__title">Total</p>
          <p className="statCard__value">{users.length}</p>
        </article>
      </section>

      <section className="card" style={{ marginTop: 16 }}>
        <section className="tableWrap">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Client</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <strong className="strong">{u.username}</strong>
                    <p className="muted">{u.id}</p>
                  </td>
                  <td>
                    <span className={roleToUi(u.role) === 'ADMIN' ? 'pill pill--info' : 'pill pill--neutral'}>
                      {roleToUi(u.role)}
                    </span>
                  </td>
                  <td>{u.clientName || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </section>
  </>
  );
}
