import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './sidebar.jsx';
import Topbar from './Topbar.jsx';

export default function AdminLayout() {
  const navigate = useNavigate();
  return (
    <section className="appShell">
      <Sidebar role="ADMIN" onNavigate={(path) => navigate(path)} />
      <section className="shellMain">
        <Topbar title="Admin" />
        <main className="shellContent">
          <Outlet />
        </main>
      </section>
    </section>
  );
}
