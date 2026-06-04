import RdvQrCode from './RdvQrCode.jsx';

export default function RdvQrModal({ rdv, onClose }) {
  if (!rdv) return null;

  return (
    <section
      className="qrModalBackdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-modal-title"
      onClick={onClose}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <article className="qrModal card" onClick={(e) => e.stopPropagation()}>
        <header className="qrModal__header">
          <h2 id="qr-modal-title" className="card__title">
            Rendez-vous approuvé — QR code
          </h2>
          <button type="button" className="btn btn--ghost" onClick={onClose} aria-label="Fermer">
            ✕
          </button>
        </header>

        <p className="muted" style={{ marginBottom: 12 }}>
          RDV n° <strong>{rdv.id}</strong> — {rdv.containerReference} — {rdv.date}
        </p>

        <section className="qrModal__body">
          <RdvQrCode rdv={rdv} size={220} />
        </section>

        <p className="hint" style={{ marginTop: 12, wordBreak: 'break-all' }}>
          Code : <code>{rdv.qrCode}</code>
        </p>
        <p className="muted" style={{ marginTop: 8, fontSize: 13 }}>
          Présentez ce QR à l&apos;entrée du port pour valider le rendez-vous.
        </p>
      </article>
    </section>
  );
}
