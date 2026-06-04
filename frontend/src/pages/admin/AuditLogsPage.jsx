import { useEffect, useState } from 'react';
import { auditService } from '../../services/auditservice.js';

function AuditLogRow({ log }) {
  return (
    <tr>
      <td>{log.id}</td>
      <td>{new Date(log.at).toLocaleString()}</td>
      <td>{log.actorUserId}</td>
      <td>{log.action}</td>
      <td>{JSON.stringify(log.target)}</td>
      <td>{JSON.stringify(log.meta)}</td>
    </tr>
  );
}

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    auditService
      .getAll()
      .then((response) => {
        if (!active) return;
        setLogs(response.data || []);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || 'Unable to load audit logs.');
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <h1 className="pageTitle">Audit Logs</h1>

      {loading && <div>Loading audit logs...</div>}
      {error && <div className="callout callout--danger">{error}</div>}

      {!loading && !error && (
        <div className="card">
          <div className="table-wrapper">
            <table className="table table--striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Timestamp</th>
                  <th>Actor</th>
                  <th>Action</th>
                  <th>Target</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.length > 0 ? (
                  logs.map((log) => <AuditLogRow key={log.id} log={log} />)
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center' }}>
                      No audit logs available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

