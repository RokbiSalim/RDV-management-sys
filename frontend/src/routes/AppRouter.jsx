import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import AdminDashboard from '../pages/admin/DashboardPage';
import AdminAppointmentsPage from '../pages/admin/AppointmentsPage';
import AdminContainersPage from '../pages/admin/ContainersPage';
import AdminUsersPage from '../pages/admin/UsersPage';
import AdminAuditPage from '../pages/admin/AuditLogsPage';
import TransporterDashboard from '../pages/transporter/TransporterDashboardPage';
import TransporterAppointmentsPage from '../pages/transporter/MyAppointmentsPage';
import TransporterCreateAppointmentPage from '../pages/transporter/CreateAppointmentPage';
import AdminLayout from '../layouts/adminlayout.jsx';
import TransporterLayout from '../layouts/TransporterLayout';
import { RequireRole } from './RequireRole';
import HomeRedirect from './HomeRedirect';
import AdminBlockagesPage from '../pages/admin/BlockagesPage';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/admin"
        element={
          <RequireRole role="ADMIN">
            <AdminLayout />
          </RequireRole>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="appointments" element={<AdminAppointmentsPage />} />
        <Route path="containers" element={<AdminContainersPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="audit" element={<AdminAuditPage />} />
        <Route path="blockages" element={<AdminBlockagesPage />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      <Route
        path="/transporter"
        element={
          <RequireRole role="TRANSPORTER">
            <TransporterLayout />
          </RequireRole>
        }
      >
        <Route path="dashboard" element={<TransporterDashboard />} />
        <Route path="appointments" element={<TransporterAppointmentsPage />} />
        <Route path="create" element={<TransporterCreateAppointmentPage />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      <Route path="/" element={<HomeRedirect />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

