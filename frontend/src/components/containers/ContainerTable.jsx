import ContainerActions from './ContainerActions.jsx';

export default function ContainerTable({ containers, onEdit, onDelete, busyId }) {
  return (
    <div className="tableWrap containersTableWrap">
      <table className="table containersTable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Reference</th>
            <th>Client</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {containers.map((container) => (
            <tr key={container.id}>
              <td>
                <div className="strong">{container.id}</div>
              </td>
              <td>
                <span className="containerReference">{container.reference}</span>
              </td>
              <td>{container.clientName || '-'}</td>
              <td>
                <ContainerActions
                  container={container}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  busy={busyId === container.id}
                />
              </td>
            </tr>
          ))}
          {containers.length === 0 ? (
            <tr>
              <td colSpan={4} className="muted">
                No results.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
