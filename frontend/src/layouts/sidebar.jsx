import { useMemo } from 'react';
import logo from '../assets/logo.png';

export default function Sidebar({ role, onNavigate }) {
  const items = useMemo(() => {
    if (role === 'ADMIN') {
      return [
        { label: 'Dashboard', to: '/admin/dashboard' },
        { label: 'Appointments', to: '/admin/appointments' },
        { label: 'Containers', to: '/admin/containers' },
        { label: 'Users', to: '/admin/users' },
        { label: 'Blockages', to: '/admin/blockages' },
        { label: 'Audit Logs', to: '/admin/audit' },
      ];
    }
    return [
      { label: 'Dashboard', to: '/transporter/dashboard' },
      { label: 'My Appointments', to: '/transporter/appointments' },
      { label: 'Create Appointment', to: '/transporter/create' },
    ];
  }, [role]);

  return (
    <aside className="sidebar">
      <section className="sidebar__brand">
        <img className="brand__logo" src={logo} alt="Logo" />
      </section>

      <nav className="sidebar__nav">
        {items.map((it) => (
          <button key={it.to} type="button" className="sidebar__link" onClick={() => onNavigate(it.to)}>
            {it.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
