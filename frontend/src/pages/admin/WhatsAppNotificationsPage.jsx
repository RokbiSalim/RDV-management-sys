import { useState } from 'react';
import { notificationService } from '../../services/notificationservice.js';

export default function WhatsAppNotificationsPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleSend = async () => {
    if (!phoneNumber.trim() || !message.trim()) return;

    setSending(true);
    setError(null);
    setResult(null);

    try {
      const response = await notificationService.sendWhatsApp({
        phoneNumber: phoneNumber.trim(),
        message: message.trim(),
      });
      setResult(response.data);
    } catch (err) {
      setError(err.message || 'Impossible d envoyer la notification WhatsApp.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section>
      <h1 className="pageTitle">Notifications WhatsApp</h1>

      {error ? <section className="callout callout--danger">{error}</section> : null}
      {result ? (
        <section className="callout callout--success" style={{ marginBottom: 16 }}>
          <section className="callout__title">Message envoye</section>
          <pre className="pre">{JSON.stringify(result, null, 2)}</pre>
        </section>
      ) : null}

      <section className="card">
        <h2 className="card__title">Envoyer un message</h2>

        <section className="field" style={{ marginTop: 14 }}>
          <label className="label">Numero WhatsApp</label>
          <input
            className="input"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="212600000000"
          />
        </section>

        <section className="field" style={{ marginTop: 14 }}>
          <label className="label">Message</label>
          <textarea
            className="input"
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Bonjour, votre rendez-vous est confirme."
          />
        </section>

        <button
          type="button"
          className="btn btn--primary"
          style={{ marginTop: 14 }}
          onClick={handleSend}
          disabled={sending || !phoneNumber.trim() || !message.trim()}
        >
          {sending ? 'Envoi...' : 'Envoyer'}
        </button>
      </section>
    </section>
  );
}
