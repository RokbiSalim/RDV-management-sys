import { useEffect, useState } from 'react';
import { useRole } from '../../context/roleContext.jsx';
import { rdvService } from '../../services/rdvservice.js';
import { lazy, Suspense } from 'react';

const RdvQrModal = lazy(() => import('../../components/RdvQrModal.jsx'));
const RdvQrCode = lazy(() => import('../../components/RdvQrCode.jsx'));
import { statusLabel } from '../../utils/format.js';
import { filterMyAppointments } from '../../utils/rdvFilters.js';
import { isApprovedRdv } from '../../utils/rdvQr.js';

export default function MyAppointmentsPage() {
  const { userId } = useRole();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qrModalRdv, setQrModalRdv] = useState(null);

  useEffect(() => {
    let active = true;

    rdvService
      .getAll()
      .then((res) => {
        if (!active) return;
        setAppointments(filterMyAppointments(res.data || [], userId));
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || 'Unable to load appointments.');
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [userId]);

  if (loading) {
    return <div>Loading appointments...</div>;
  }

  return (
    <>
    <section>
      <h1 className="pageTitle">Mes rendez-vous</h1>
      {error ? <div className="callout callout--danger">{error}</div> : null}

      <div className="card">
        <div className="tableWrap">
          <table className="table">
            <thead>
              <tr>
                <th>Appointment</th>
                <th>Container</th>
                <th>Status</th>
                <th>Date</th>
                <th>QR</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => {
                const pill = statusLabel(String(a.statut || '').toLowerCase());
                return (
                  <tr key={a.id}>
                    <td>
                      <div className="strong">{a.id}</div>
                      <div className="muted">{a.trancheTime || a.clientName || ''}</div>
                    </td>
                    <td>{a.containerReference || '-'}</td>
                    <td>
                      <span className={pill.className}>{pill.text}</span>
                    </td>
                    <td>{new Date(a.date).toLocaleDateString('fr-FR')}</td>
                    <td>
                      {isApprovedRdv(a) && a.qrCode ? (
                        <button type="button" className="qrThumb" onClick={() => setQrModalRdv(a)} title="QR code">
                          <Suspense fallback={<span className="muted">…</span>}>
                            <RdvQrCode rdv={a} size={48} />
                          </Suspense>
                        </button>
                      ) : (
                        <span className="muted">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="muted">
                    No appointments.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <Suspense fallback={null}>
      <RdvQrModal rdv={qrModalRdv} onClose={() => setQrModalRdv(null)} />
    </Suspense>
    </>
  );
}

