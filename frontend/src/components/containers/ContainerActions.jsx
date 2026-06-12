export default function ContainerActions({ container, onEdit, onDelete, busy }) {
  return (
    <div className="containerActions">
      <button
        type="button"
        className="btn btn--secondary btn--compact"
        onClick={() => onEdit(container)}
        disabled={busy}
      >
        <span aria-hidden="true">✏️</span>
        Modifier
      </button>
      <button
        type="button"
        className="btn btn--danger btn--compact"
        onClick={() => onDelete(container)}
        disabled={busy}
      >
        <span aria-hidden="true">🗑️</span>
        Supprimer
      </button>
    </div>
  );
}
