import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './sidebar.jsx';
import Topbar from './Topbar';

export default function TransporterLayout() {
  const navigate = useNavigate();
  return (
    <div className="appShell appShell--transporter">
      <Sidebar role="TRANSPORTER" onNavigate={(path) => navigate(path)} />
      <div className="shellMain">
        <Topbar title="Transporter" />
        <main className="shellContent">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

