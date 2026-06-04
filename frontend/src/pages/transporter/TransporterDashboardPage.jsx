import { useEffect, useMemo, useState } from 'react';
import { useRole } from '../../context/roleContext.jsx';
import { rdvService } from '../../services/rdvservice.js';
import { containerService } from '../../services/containerservice.js';
import { normalizeStatut } from '../../utils/backendMaps.js';
import { filterMyAppointments } from '../../utils/rdvFilters.js';
import DashboardCharts from '../../components/DashboardCharts.jsx';

function StatCard({ title, value }) {
  return (
    <div className="card statCard">
      <div className="statCard__title">{title}</div>
      <div className="statCard__value">{value}</div>
    </div>
  );
}

export default function TransporterDashboardPage() {
  const { userId } = useRole();
  const [appointments, setAppointments] = useState([]);
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    Promise.all([rdvService.getAll(), containerService.getAll()])
      .then(([appointmentsRes, containersRes]) => {
        if (!active) return;
        setAppointments(filterMyAppointments(appointmentsRes.data || [], userId));
        setContainers(containersRes.data || []);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || 'Unable to load dashboard data.');
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [userId]);

  const stats = useMemo(() => {
    const pending = appointments.filter((a) => normalizeStatut(a.statut) === 'pending').length;
    const approved = appointments.filter((a) => normalizeStatut(a.statut) === 'approved').length;
    const rejected = appointments.filter((a) => normalizeStatut(a.statut) === 'rejected').length;
    const availableContainers = containers.length;
    return { pending, approved, rejected, total: appointments.length, availableContainers };
  }, [appointments, containers]);

  if (loading) {
    return <div>Loading Transporter dashboard...</div>;
  }

  return (
    <div>
      <h1 className="pageTitle">Transporter Dashboard</h1>
      {error ? <div className="callout callout--danger">{error}</div> : null}

      <div className="grid grid--3">
        <StatCard title="My Appointments" value={stats.total} />
        <StatCard title="Approved" value={stats.approved} />
        <StatCard title="Pending" value={stats.pending} />
      </div>

      <div className="grid grid--3" style={{ marginTop: 16 }}>
        <StatCard title="Rejected" value={stats.rejected} />
        <div className="card statCard">
          <div className="statCard__title">Available Containers</div>
          <div className="statCard__value">{stats.availableContainers}</div>
          <div className="statCard__hint">Used when creating new appointments</div>
        </div>
        <div className="card" style={{ textAlign: 'left' }}>
          <div className="card__header">
            <h2 className="card__title">Status Tracking</h2>
          </div>
          <p className="muted">Les demandes sont enregistrées via l&apos;API ; l&apos;admin confirme ou annule sur le backend.</p>
        </div>
      </div>

      <DashboardCharts appointments={appointments} stats={stats} />
    </div>
  );
}

