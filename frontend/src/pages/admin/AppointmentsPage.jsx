import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import RdvQrCode from '../../components/RdvQrCode.jsx';
import { containerService } from '../../services/containerservice.js';
import { rdvService } from '../../services/rdvservice.js';
import { normalizeStatut } from '../../utils/backendMaps.js';
import { statusLabel } from '../../utils/format.js';
import { isApprovedRdv } from '../../utils/rdvQr.js';

const RdvQrModal = lazy(() => import('../../components/RdvQrModal.jsx'));

function TextInput({ value, onChange, placeholder }) {
  return (
    <input className="input" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
  );
}

function Select({ value, onChange, options }) {
  return (
    <select className="input" value={value} onChange={(event) => onChange(event.target.value)}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function normalizeAdminStatus(statut) {
  const normalized = normalizeStatut(statut);
  return normalized === 'pending' ? 'approved' : normalized;
}

export default function AdminAppointmentsPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [appointments, setAppointments] = useState([]);
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionId, setActionId] = useState(null);
  const [qrModalRdv, setQrModalRdv] = useState(null);

  const loadData = () => {
    setLoading(true);
    return Promise.all([rdvService.getAll(), containerService.getAll()])
      .then(([rdvsRes, containersRes]) => {
        setAppointments(rdvsRes.data || []);
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

  const updateAppointment = (id, updated) => {
    setAppointments((items) => items.map((item) => (item.id === id ? { ...item, ...updated } : item)));
  };

  const handleApprove = async (appointment) => {
    setActionId(appointment.id);
    try {
      const response = await rdvService.confirm(appointment.id);
      const updated = response.data || { id: appointment.id, statut: 'CONFIRMED' };
      updateAppointment(appointment.id, updated);
      if (response.data?.qrCode) {
        setQrModalRdv(response.data);
      }
    } catch (err) {
      setError(err.message || 'Unable to approve appointment.');
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (appointment) => {
    const confirmed = window.confirm('Refuser ce rendez-vous ?');
    if (!confirmed) return;

    setActionId(appointment.id);
    try {
      const response = await rdvService.cancel(appointment.id);
      const updated = response.data || { id: appointment.id, statut: 'CANCELLED' };
      updateAppointment(appointment.id, updated);
    } catch (err) {
      setError(err.message || 'Unable to reject appointment.');
    } finally {
      setActionId(null);
    }
  };

  const enriched = useMemo(() => {
    const byContainerRef = Object.fromEntries(containers.map((container) => [container.reference, container]));

    return appointments.map((appointment) => ({
      ...appointment,
      transporter: appointment.transporterName || 'Unknown',
      container: appointment.containerReference || byContainerRef[appointment.containerReference]?.reference || 'Unknown',
      requestedBy: appointment.clientName || 'Unknown',
      status: normalizeAdminStatus(appointment.statut),
      scheduledAt: appointment.date,
    }));
  }, [appointments, containers]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return enriched.filter((appointment) => {
      const matchQ =
        !q ||
        String(appointment.id).toLowerCase().includes(q) ||
        String(appointment.container).toLowerCase().includes(q) ||
        String(appointment.transporter).toLowerCase().includes(q) ||
        String(appointment.status).toLowerCase().includes(q) ||
        String(appointment.requestedBy).toLowerCase().includes(q);
      const matchStatus = status === 'all' ? true : appointment.status === status;
      return matchQ && matchStatus;
    });
  }, [enriched, query, status]);

  if (loading) {
    return <p>Chargement des rendez-vous...</p>;
  }

  return (
    <>
      <h1 className="pageTitle">Gerer les rendez-vous</h1>
      {error ? <p className="callout callout--danger">{error}</p> : null}

      <section className="card">
        <section className="filters">
          <section className="filters__item">
            <label className="label">Recherche</label>
            <TextInput value={query} onChange={setQuery} placeholder="id, conteneur, transporteur..." />
          </section>
          <section className="filters__item">
            <label className="label">Statut</label>
            <Select
              value={status}
              onChange={setStatus}
              options={[
                { value: 'all', label: 'Tous' },
                { value: 'approved', label: 'Approuve' },
                { value: 'rejected', label: 'Refuse' },
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
              {filtered.map((appointment) => {
                const pill = statusLabel(appointment.status);
                const approved = isApprovedRdv(appointment) && appointment.qrCode;

                return (
                  <tr key={appointment.id}>
                    <td>
                      <strong className="strong">{appointment.id}</strong>
                      <p className="muted">{appointment.trancheTime || ''}</p>
                    </td>
                    <td>{appointment.container}</td>
                    <td>{appointment.transporter}</td>
                    <td>{appointment.requestedBy}</td>
                    <td>
                      <span className={pill.className}>{pill.text}</span>
                    </td>
                    <td>{new Date(appointment.scheduledAt).toLocaleDateString('fr-FR')}</td>
                    <td>
                      {approved ? (
                        <button
                          type="button"
                          className="qrThumb"
                          title="Voir le QR code"
                          onClick={() => setQrModalRdv(appointment)}
                        >
                          <Suspense fallback={<span className="muted">...</span>}>
                            <RdvQrCode rdv={appointment} size={56} />
                          </Suspense>
                        </button>
                      ) : (
                        <span className="muted">-</span>
                      )}
                    </td>
                    <td>
                      <section className="appointmentActions">
                        {appointment.status === 'rejected' ? (
                          <button
                            type="button"
                            className="btn btn--primary btn--compact"
                            disabled={actionId === appointment.id}
                            onClick={() => handleApprove(appointment)}
                          >
                            Approuver
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn--danger btn--compact"
                            disabled={actionId === appointment.id}
                            onClick={() => handleReject(appointment)}
                          >
                            Refuser
                          </button>
                        )}
                      </section>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="muted">
                    Aucun resultat.
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
