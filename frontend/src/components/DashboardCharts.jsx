import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function StatusDoughnut({ pending, approved, rejected }) {
  const data = {
    labels: ['Approved', 'Pending', 'Rejected'],
    datasets: [
      {
        data: [approved, pending, rejected],
        backgroundColor: ['#16a34a', '#f59e0b', '#ef4444'],
        hoverOffset: 6,
      },
    ],
  };
  return (
    <div className="card">
      <div className="card__header">
        <h3 className="card__title">Status Distribution</h3>
      </div>
      <div style={{ width: '100%', maxWidth: 420, margin: '0 auto', padding: 12 }}>
        <Doughnut data={data} />
      </div>
    </div>
  );
}

function AppointmentsBar({ appointments }) {
  // build a simple count per day (YYYY-MM-DD)
  const counts = {};
  (appointments || []).forEach((a) => {
    const d = a.date?.split?.('T')?.[0] || a.date || a.createdAt || 'unknown';
    counts[d] = (counts[d] || 0) + 1;
  });
  const labels = Object.keys(counts).sort();
  const data = {
    labels,
    datasets: [
      {
        label: 'Appointments',
        data: labels.map((l) => counts[l]),
        backgroundColor: '#3b82f6',
      },
    ],
  };

  return (
    <div className="card">
      <div className="card__header">
        <h3 className="card__title">Appointments Over Time</h3>
      </div>
      <div style={{ padding: 12 }}>
        <Bar
          options={{
            responsive: true,
            plugins: { title: { display: false } },
          }}
          data={data}
        />
      </div>
    </div>
  );
}

export default function DashboardCharts({ appointments = [], stats = {} }) {
  return (
    <div className="grid grid--2" style={{ marginTop: 16 }}>
      <StatusDoughnut pending={stats.pending || 0} approved={stats.approved || 0} rejected={stats.rejected || 0} />
      <AppointmentsBar appointments={appointments} />
    </div>
  );
}
