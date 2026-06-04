import { useEffect, useMemo, useState } from 'react';
import { rdvService } from '../../services/rdvservice.js';
import { containerService } from '../../services/containerservice.js';
import { userService } from '../../services/userservice.js';
import { lazy, Suspense } from 'react';

const RdvQrModal = lazy(() => import('../../components/RdvQrModal.jsx'));
const RdvQrCode = lazy(() => import('../../components/RdvQrCode.jsx'));
import { normalizeStatut } from '../../utils/backendMaps.js';
import { statusLabel } from '../../utils/format.js';
import { isApprovedRdv } from '../../utils/rdvQr.js';

function TextInput({ value, onChange, placeholder }) {
  return (
    <input className="input" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
  );
}

function Select({ value, onChange, options }) {
  return (
    <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export default function AdminAppointmentsPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]);
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionId, setActionId] = useState(null);
  const [qrModalRdv, setQrModalRdv] = useState(null);

  const loadData = () => {
    setLoading(true);
    return Promise.all([rdvService.getAll(), userService.getAll(), containerService.getAll()])
      .then(([rdvsRes, usersRes, containersRes]) => {
        setAppointments(rdvsRes.data || []);
        setUsers(usersRes.data || []);
        setContainers(containersRes.data || []);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || 'Unable to load appointments.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleConfirm = async (id) => {
    setActionId(id);
    try {
      const res = await rdvService.confirm(id);
      await loadData();
      if (res.data?.qrCode) {
        setQrModalRdv(res.data);
      }
    } catch (err) {
      setError(err.message || 'Unable to confirm appointment.');
    } finally {
      setActionId(null);
    }
  };

  const handleCancel = async (id) => {
    setActionId(id);
    try {
      await rdvService.cancel(id);
      await loadData();
    } catch (err) {
      setError(err.message || 'Unable to cancel appointment.');
    } finally {
      setActionId(null);
    }
  };

  const enriched = useMemo(() => {
    const byContainerRef = Object.fromEntries(containers.map((c) => [c.reference, c]));

    return appointments.map((a) => ({
      ...a,
      transporter: a.transporterName || 'Unknown',
      container: a.containerReference || byContainerRef[a.containerReference]?.reference || 'Unknown',
      requestedBy: a.clientName || 'Unknown',
      status: normalizeStatut(a.statut),
      scheduledAt: a.date,
    }));
  }, [appointments, containers, users]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return enriched.filter((a) => {
      const matchQ =
        !q ||
        String(a.id).toLowerCase().includes(q) ||
        String(a.container).toLowerCase().includes(q) ||
        String(a.transporter).toLowerCase().includes(q) ||
        String(a.status).toLowerCase().includes(q) ||
        String(a.requestedBy).toLowerCase().includes(q);
      const matchStatus = status === 'all' ? true : a.status === status;
      return matchQ && matchStatus;
    });
  }, [enriched, query, status]);

  if (loading) {
    return <p>Chargement des rendez-vous…</p>;
  }

  return (
    <>
      <h1 className="pageTitle">Gérer les rendez-vous</h1>
      {error ? <p className="callout callout--danger">{error}</p> : null}

      <section className="card">
        <section className="filters">
          <section className="filters__item">
            <label className="label">Recherche</label>
            <TextInput value={query} onChange={setQuery} placeholder="id, conteneur, transporteur…" />
          </section>
          <section className="filters__item">
            <label className="label">Statut</label>
            <Select
              value={status}
              onChange={setStatus}
              options={[
                { value: 'all', label: 'Tous' },
                { value: 'pending', label: 'En attente' },
                { value: 'approved', label: 'Approuvé' },
                { value: 'rejected', label: 'Refusé' },
              ]}
            />
          </section>
        </section>

        <section className="tableWrap">
          <table className="table">
            <thead>
              <tr>
                <th>RDV</th>
                <th>Conteneur</th>
                <th>Transporteur</th>
                <th>Client</th>
                <th>Statut</th>
                <th>Date</th>
                <th>QR</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => {
                const pill = statusLabel(a.status);
                const approved = isApprovedRdv(a) && a.qrCode;
                return (
                  <tr key={a.id}>
                    <td>
                      <strong className="strong">{a.id}</strong>
                      <p className="muted">{a.trancheTime || ''}</p>
                    </td>
                    <td>{a.container}</td>
                    <td>{a.transporter}</td>
                    <td>{a.requestedBy}</td>
                    <td>
                      <span className={pill.className}>{pill.text}</span>
                    </td>
                    <td>{new Date(a.scheduledAt).toLocaleDateString('fr-FR')}</td>
                    <td>
                      {approved ? (
                        <button
                          type="button"
                          className="qrThumb"
                          title="Voir le QR code"
                          onClick={() => setQrModalRdv(a)}
                        >
                          <Suspense fallback={<span className="muted">…</span>}>
                            <RdvQrCode rdv={a} size={56} />
                          </Suspense>
                        </button>
                      ) : (
                        <span className="muted">—</span>
                      )}
                    </td>
                    <td>
                      {a.status === 'pending' ? (
                        <section style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            className="btn btn--primary"
                            disabled={actionId === a.id}
                            onClick={() => handleConfirm(a.id)}
                          >
                            Approuver
                          </button>
                          <button
                            type="button"
                            className="btn btn--ghost"
                            disabled={actionId === a.id}
                            onClick={() => handleCancel(a.id)}
                          >
                            Refuser
                          </button>
                        </section>
                      ) : (
                        <span className="muted">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="muted">
                    Aucun résultat.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </section>
      </section>

      <Suspense fallback={null}>
        <RdvQrModal rdv={qrModalRdv} onClose={() => setQrModalRdv(null)} />
      </Suspense>
    </>
  );
}
