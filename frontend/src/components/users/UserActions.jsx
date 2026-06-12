export default function UserActions({ user, isCurrentUser, busy, onEdit, onDelete }) {
  return (
    <div className="userActions">
      <button
        type="button"
        className="btn btn--secondary btn--compact"
        onClick={() => onEdit(user)}
        disabled={busy}
      >
        <span aria-hidden="true">✏️</span>
        Modifier
      </button>
      <button
        type="button"
        className="btn btn--danger btn--compact"
        onClick={() => onDelete(user)}
        disabled={busy || isCurrentUser}
        title={isCurrentUser ? 'Impossible de supprimer le compte connecte' : 'Supprimer'}
      >
        <span aria-hidden="true">🗑️</span>
        Supprimer
      </button>
    </div>
  );
}
