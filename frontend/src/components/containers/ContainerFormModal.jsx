import { useEffect, useMemo, useState } from 'react';

const initialForm = {
  reference: '',
  clientId: '',
};

export default function ContainerFormModal({ mode, container, clients, onClose, onSubmit, saving }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!container) {
      setForm(initialForm);
      setErrors({});
      return;
    }

    setForm({
      reference: container.reference || '',
      clientId: container.clientId ? String(container.clientId) : '',
    });
    setErrors({});
  }, [container]);

  const title = mode === 'edit' ? 'Modifier le conteneur' : 'Ajouter un conteneur';
  const submitLabel = mode === 'edit' ? '✏️ Sauvegarder' : '➕ Ajouter';

  const clientOptions = useMemo(
    () => clients.map((client) => ({ value: String(client.id), label: client.name })),
    [clients],
  );

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};
    if (!form.reference.trim()) nextErrors.reference = 'Reference obligatoire.';
    if (!form.clientId) nextErrors.clientId = 'Client obligatoire.';

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      reference: form.reference.trim(),
      clientId: Number(form.clientId),
    });
  };

  return (
    <div className="modalBackdrop" role="presentation">
      <section className="card containerModal" role="dialog" aria-modal="true" aria-labelledby="container-modal-title">
        <div className="modalHeader">
          <div>
            <p className="modalEyebrow">Marsa Maroc</p>
            <h2 id="container-modal-title" className="modalTitle">{title}</h2>
          </div>
          <button type="button" className="modalClose" onClick={onClose} aria-label="Fermer">
            ×
          </button>
        </div>

        <form className="containerForm" onSubmit={handleSubmit}>
          <div className="field">
            <label className="label" htmlFor="container-reference">Reference</label>
            <input
              id="container-reference"
              className="input"
              value={form.reference}
              onChange={(event) => updateField('reference', event.target.value)}
              placeholder="MSKU1234567"
              autoFocus
            />
            {errors.reference ? <span className="fieldError">{errors.reference}</span> : null}
          </div>

          <div className="field">
            <label className="label" htmlFor="container-client">Client</label>
            <select
              id="container-client"
              className="input"
              value={form.clientId}
              onChange={(event) => updateField('clientId', event.target.value)}
            >
              <option value="">Selectionner un client</option>
              {clientOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.clientId ? <span className="fieldError">{errors.clientId}</span> : null}
          </div>

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
