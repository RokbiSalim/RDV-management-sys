import { roleToUi } from '../../utils/backendMaps.js';
import UserActions from './UserActions.jsx';

export default function UserTable({ users, currentSession, busyId, onEdit, onDelete }) {
  const isConnectedUser = (user) =>
    String(user.id) === String(currentSession?.userId) ||
    String(user.username || '').toLowerCase() === String(currentSession?.username || '').toLowerCase();

  return (
    <div className="tableWrap usersTableWrap">
      <table className="table usersTable">
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Client</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const uiRole = roleToUi(user.role);
            const currentUser = isConnectedUser(user);

            return (
              <tr key={user.id}>
                <td>
                  <strong className="strong">{user.username}</strong>
                  <p className="muted">{user.id}</p>
                </td>
                <td>
                  <span className={uiRole === 'ADMIN' ? 'pill pill--info' : 'pill pill--neutral'}>
                    {uiRole}
                  </span>
                </td>
                <td>{user.clientName || '-'}</td>
                <td>
                  <UserActions
                    user={user}
                    isCurrentUser={currentUser}
                    busy={busyId === user.id}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </td>
              </tr>
            );
          })}
          {users.length === 0 ? (
            <tr>
              <td colSpan={4} className="muted">
                No users found.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
