import { useEffect, useMemo, useState } from 'react';
import { rdvService } from '../../services/rdvservice.js';
import { containerService } from '../../services/containerservice.js';
import { auditService } from '../../services/auditservice.js';
import { normalizeStatut } from '../../utils/backendMaps.js';
import DashboardCharts from '../../components/DashboardCharts.jsx';

function StatCard({ title, value, hint }) {
  return (
    <div className="card statCard">
      <div className="statCard__title">{title}</div>
      <div className="statCard__value">{value}</div>
      {hint ? <div className="statCard__hint">{hint}</div> : null}
    </div>
  );
}

export default function AdminDashboardPage() {
  const [appointments, setAppointments] = useState([]);
  const [containers, setContainers] = useState([]);
  const [auditCount, setAuditCount] = useState('N/A');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    Promise.all([rdvService.getAll(), containerService.getAll(), auditService.getAll()])
      .then(([rdvsRes, containersRes, auditRes]) => {
        if (!active) return;
        setAppointments(rdvsRes.data || []);
        setContainers(containersRes.data || []);
        setAuditCount(auditRes.data?.length ?? '0');
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
  }, []);

  const stats = useMemo(() => {
    const total = appointments.length;
    const pending = appointments.filter((a) => normalizeStatut(a.statut) === 'pending').length;
    const approved = appointments.filter((a) => normalizeStatut(a.statut) === 'approved').length;
    const rejected = appointments.filter((a) => normalizeStatut(a.statut) === 'rejected').length;
    const availableContainers = containers.length;

    return {
      total,
      pending,
      approved,
      rejected,
      availableContainers,
      auditCount,
    };
  }, [appointments, containers, auditCount]);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div>
      <h1 className="pageTitle">Admin Dashboard</h1>
      {error ? <div className="callout callout--danger">{error}</div> : null}

      <div className="grid grid--3">
        <StatCard title="Total Appointments" value={stats.total} hint="All statuses" />
        <StatCard title="Approved" value={stats.approved} hint="Confirmed RDVs" />
        <StatCard title="Pending" value={stats.pending} hint="Waiting decision" />
      </div>

      <div className="grid grid--3" style={{ marginTop: 16 }}>
        <StatCard title="Rejected" value={stats.rejected} hint="Needs attention" />
        <StatCard title="Available Containers" value={stats.availableContainers} hint="Ready for assignment" />
        <StatCard title="Audit Events" value={stats.auditCount} hint="Live audit events" />
      </div>

      <DashboardCharts appointments={appointments} stats={stats} />
    </div>
  );
}

