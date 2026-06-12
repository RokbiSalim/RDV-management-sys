import { useCallback, useEffect, useMemo, useState } from 'react';
import UserFormModal from '../../components/users/UserFormModal.jsx';
import UserTable from '../../components/users/UserTable.jsx';
import { fallbackClients } from '../../data/containerCrudFallback.js';
import { buildUserFromPayload, fallbackUsers, normalizeUser } from '../../data/userCrudFallback.js';
import { clientService } from '../../services/clientservice.js';
import { userService } from '../../services/userservice.js';
import { roleToUi } from '../../utils/backendMaps.js';
import { getSession } from '../../utils/session.js';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [modalState, setModalState] = useState({ open: false, mode: 'add', user: null });

  const session = useMemo(() => getSession(), []);

  const visibleUsers = useMemo(
    () => users.map((user) => normalizeUser(user, clients)),
    [users, clients],
  );

  const stats = useMemo(() => {
    const admins = visibleUsers.filter((user) => roleToUi(user.role) === 'ADMIN').length;
    const transporters = visibleUsers.filter((user) => roleToUi(user.role) === 'TRANSPORTER').length;
    return {
      admins,
      transporters,
      total: visibleUsers.length,
    };
  }, [visibleUsers]);

  const loadData = useCallback(() => {
    setLoading(true);
    setError(null);

    return Promise.allSettled([userService.getAll(), clientService.getAll()])
      .then(([usersResult, clientsResult]) => {
        const nextClients =
          clientsResult.status === 'fulfilled'
            ? clientsResult.value.data || []
            : fallbackClients;

        const nextUsers =
          usersResult.status === 'fulfilled'
            ? usersResult.value.data || []
            : fallbackUsers;

        setClients(nextClients);
        setUsers(nextUsers.map((user) => normalizeUser(user, nextClients)));

        if (usersResult.status === 'rejected' || clientsResult.status === 'rejected') {
          setNotice('Mode local actif: certaines donnees viennent du fallback.');
        }
      })
      .catch((err) => {
        setError(err.message || 'Unable to load users.');
        setClients(fallbackClients);
        setUsers(fallbackUsers);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openAddModal = () => {
    setModalState({ open: true, mode: 'add', user: null });
    setError(null);
  };

  const openEditModal = (user) => {
    setModalState({ open: true, mode: 'edit', user });
    setError(null);
  };

  const closeModal = () => {
    if (saving) return;
    setModalState({ open: false, mode: 'add', user: null });
  };

  const isConnectedUser = (user) =>
    String(user.id) === String(session?.userId) ||
    String(user.username || '').toLowerCase() === String(session?.username || '').toLowerCase();

  const saveUser = async (payload) => {
    setSaving(true);
    setError(null);
    setNotice(null);

    const currentUser = modalState.user;
    const localUser = buildUserFromPayload(payload, clients, currentUser);

    try {
      if (modalState.mode === 'edit' && currentUser) {
        const response = await userService.update(currentUser.id, payload);
        const updated = normalizeUser(response.data || localUser, clients);
        setUsers((items) => items.map((item) => (item.id === currentUser.id ? updated : item)));
        setNotice('Utilisateur modifie avec succes.');
      } else {
        const response = await userService.create(payload);
        const created = normalizeUser(response.data || localUser, clients);
        setUsers((items) => [created, ...items]);
        setNotice('Utilisateur cree avec succes.');
      }
    } catch {
      if (modalState.mode === 'edit' && currentUser) {
        setUsers((items) => items.map((item) => (item.id === currentUser.id ? localUser : item)));
        setNotice('Modification appliquee localement. API update indisponible.');
      } else {
        setUsers((items) => [localUser, ...items]);
        setNotice('Creation appliquee localement. API create indisponible.');
      }
    } finally {
      setSaving(false);
      setModalState({ open: false, mode: 'add', user: null });
    }
  };

  const deleteUser = async (user) => {
    if (isConnectedUser(user)) {
      setError('Impossible de supprimer le compte admin connecte.');
      return;
    }

    const confirmed = window.confirm(`Supprimer l'utilisateur ${user.username} ?`);
    if (!confirmed) return;

    setBusyId(user.id);
    setError(null);
    setNotice(null);

    try {
      await userService.delete(user.id);
      setNotice('Utilisateur supprime avec succes.');
    } catch {
      setNotice('Suppression appliquee localement. API delete indisponible.');
    } finally {
      setUsers((items) => items.filter((item) => item.id !== user.id));
      setBusyId(null);
    }
  };

  if (loading) {
    return <p>Loading users...</p>;
  }

  return (
    <div className="usersPage">
      <div className="pageHeader">
        <div>
          <p className="pageEyebrow">Marsa Maroc</p>
          <h1 className="pageTitle">Users</h1>
        </div>
        <button type="button" className="btn btn--primary" onClick={openAddModal}>
          Créer
        </button>
      </div>

      {error ? <p className="callout callout--danger">{error}</p> : null}
      {notice ? <p className="callout callout--success">{notice}</p> : null}

      <section className="grid grid--3">
        <article className="card statCard">
          <p className="statCard__title">Admins</p>
          <p className="statCard__value">{stats.admins}</p>
        </article>
        <article className="card statCard">
          <p className="statCard__title">Transporters</p>
          <p className="statCard__value">{stats.transporters}</p>
        </article>
        <article className="card statCard">
          <p className="statCard__title">Total</p>
          <p className="statCard__value">{stats.total}</p>
        </article>
      </section>

      <section className="card usersCard">
        <UserTable
          users={visibleUsers}
          currentSession={session}
          busyId={busyId}
          onEdit={openEditModal}
          onDelete={deleteUser}
        />
      </section>

      {modalState.open ? (
        <UserFormModal
          mode={modalState.mode}
          user={modalState.user}
          clients={clients}
          saving={saving}
          onClose={closeModal}
          onSubmit={saveUser}
        />
      ) : null}
    </div>
  );
}
