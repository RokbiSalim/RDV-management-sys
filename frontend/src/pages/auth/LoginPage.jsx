import { Navigate } from 'react-router-dom';
import { useRole } from '../../context/roleContext.jsx';
import { loginWithKeycloak } from '../../services/keycloakservice.js';

export default function LoginPage() {
  const { role, authReady } = useRole();

  if (!authReady) {
    return (
      <section className="authPage">
        <section className="authCard">
          <p className="muted">Chargement...</p>
        </section>
      </section>
    );
  }

  if (role) {
    const dest = role === 'ADMIN' ? '/admin/dashboard' : '/transporter/dashboard';
    return <Navigate to={dest} replace />;
  }

  return (
    <section className="authPage">
      <section className="authCard">
        <section className="authHeader">
          <section className="authLogo">RDV</section>
          <section>
            <h1 className="authTitle">Container Appointment Manager</h1>
            <p className="authSubtitle">Connectez-vous avec Keycloak.</p>
          </section>
        </section>

        <button
          type="button"
          className="btn btn--primary authBtn"
          onClick={() => loginWithKeycloak()}
        >
          Se connecter
        </button>

        <p className="hint">
          Votre role est lu depuis le token Keycloak.
        </p>
      </section>
    </section>
  );
}
