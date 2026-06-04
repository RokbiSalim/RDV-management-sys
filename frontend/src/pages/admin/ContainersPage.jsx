import { useEffect, useState } from 'react';
import { containerService } from '../../services/containerservice.js';

export default function AdminContainersPage() {
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    containerService
      .getAll()
      .then((res) => {
        if (!active) return;
        setContainers(res.data || []);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || 'Unable to load containers.');
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <div>Loading containers...</div>;
  }

  return (
    <div>
      <h1 className="pageTitle">Manage Containers</h1>
      {error ? <div className="callout callout--danger">{error}</div> : null}

      <div className="tableWrap">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Reference</th>
              <th>Client</th>
            </tr>
          </thead>
          <tbody>
            {containers.map((c) => (
              <tr key={c.id}>
                <td>
                  <div className="strong">{c.id}</div>
                </td>
                <td>{c.reference}</td>
                <td>{c.clientName || '-'}</td>
              </tr>
            ))}
            {containers.length === 0 ? (
              <tr>
                <td colSpan={3} className="muted">
                  No results.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

