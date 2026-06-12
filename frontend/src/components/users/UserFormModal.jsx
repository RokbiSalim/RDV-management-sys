import { useEffect, useState } from 'react';
import { roleToBackend, roleToUi } from '../../utils/backendMaps.js';

const initialForm = {
  username: '',
  role: 'TRANSPORTER',
  clientId: '',
};

export default function UserFormModal({ mode, user, clients, saving, onClose, onSubmit }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!user) {
      setForm(initialForm);
      setErrors({});
      return;
    }

    setForm({
      username: user.username || '',
      role: roleToUi(user.role) || 'TRANSPORTER',
      clientId: user.clientId ? String(user.clientId) : '',
    });
    setErrors({});
  }, [user]);

  const title = mode === 'edit' ? 'Modifier utilisateur' : 'Ajouter utilisateur';
  const submitLabel = mode === 'edit' ? '✏️ Sauvegarder' : 'Créer';

  const updateField = (field, value) => {
    setForm((current) => {
      const next = { ...current, [field]: value };
      if (field === 'role' && value === 'ADMIN') next.clientId = '';
      return next;
    });
    setErrors((current) => ({ ...current, [field]: '' }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.username.trim()) nextErrors.username = "Nom d'utilisateur obligatoire.";
    if (!form.role) nextErrors.role = 'Role obligatoire.';
    if (form.role === 'TRANSPORTER' && !form.clientId) {
      nextErrors.clientId = 'Client obligatoire pour un transporteur.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    onSubmit({
      username: form.username.trim(),
      role: roleToBackend(form.role),
      clientId: form.role === 'TRANSPORTER' ? Number(form.clientId) : null,
    });
  };

  return (
    <div className="modalBackdrop" role="presentation">
      <section className="card userModal" role="dialog" aria-modal="true" aria-labelledby="user-modal-title">
        <div className="modalHeader">
          <div>
            <p className="modalEyebrow">Marsa Maroc</p>
            <h2 id="user-modal-title" className="modalTitle">{title}</h2>
          </div>
          <button type="button" className="modalClose" onClick={onClose} aria-label="Fermer">
            ×
          </button>
        </div>

        <form className="userForm" onSubmit={handleSubmit}>
          <div className="field">
            <label className="label" htmlFor="user-username">Nom d'utilisateur</label>
            <input
              id="user-username"
              className="input"
              value={form.username}
              onChange={(event) => updateField('username', event.target.value)}
              placeholder="ex: transporteur"
              autoFocus
            />
            {errors.username ? <span className="fieldError">{errors.username}</span> : null}
          </div>

          <div className="field">
            <label className="label" htmlFor="user-role">Role</label>
            <select
              id="user-role"
              className="input"
              value={form.role}
              onChange={(event) => updateField('role', event.target.value)}
            >
              <option value="ADMIN">ADMIN</option>
              <option value="TRANSPORTER">TRANSPORTER</option>
            </select>
            {errors.role ? <span className="fieldError">{errors.role}</span> : null}
          </div>

          {form.role === 'TRANSPORTER' ? (
            <div className="field">
              <label className="label" htmlFor="user-client">Client</label>
              <select
                id="user-client"
                className="input"
                value={form.clientId}
                onChange={(event) => updateField('clientId', event.target.value)}
              >
                <option value="">Selectionner un client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
              {errors.clientId ? <span className="fieldError">{errors.clientId}</span> : null}
            </div>
          ) : null}

          <div className="modalActions">
            <button type="button" className="btn btn--secondary" onClick={onClose} disabled={saving}>
              Annuler
            </button>
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? 'Sauvegarde...' : submitLabel}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
