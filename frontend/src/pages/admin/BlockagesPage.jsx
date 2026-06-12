import { useCallback, useEffect, useState } from 'react';
import { blockageService } from '../../services/blockageservice.js';
import { trancheService } from '../../services/trancheservice.js';

export default function AdminBlockagesPage() {
  const [blockages, setBlockages] = useState([]);
  const [tranches, setTranches] = useState([]);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [trancheId, setTrancheId] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionId, setActionId] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    return Promise.all([blockageService.getAll(), trancheService.getAll()])
      .then(([blockRes, trancheRes]) => {
        setBlockages(blockRes.data || []);
        const list = trancheRes.data || [];
        setTranches(list);
        if (!trancheId && list[0]?.id) setTrancheId(String(list[0].id));
        setError(null);
      })
      .catch((err) => setError(err.message || 'Impossible de charger les blocages.'))
      .finally(() => setLoading(false));
  }, [trancheId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleBlock = async () => {
    try {
      await blockageService.block({
        date,
        trancheId: Number(trancheId),
        reason: reason || undefined,
      });
      setReason('');
      await load();
    } catch (err) {
      setError(err.message || 'Impossible de bloquer la tranche.');
    }
  };

  const handleUnblock = async (id) => {
    setActionId(id);
    try {
      await blockageService.unblock(id);
      await load();
    } catch (err) {
      setError(err.message || 'Impossible de débloquer.');
    } finally {
      setActionId(null);
    }
  };

  if (loading) return <section>Chargement…</section>;

  return (
    <section>
      <h1 className="pageTitle">Blocages de tranches</h1>
      {error ? <section className="callout callout--danger">{error}</section> : null}

      <section className="card" style={{ marginBottom: 16 }}>
        <h2 className="card__title">Nouveau blocage</h2>
        <section className="filters" style={{ gap: 12 }}>
          <section className="field" style={{ flex: 1 }}>
            <label className="label">Date</label>
            <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </section>
          <section className="field" style={{ flex: 1 }}>
            <label className="label">Tranche</label>
            <select className="input" value={trancheId} onChange={(e) => setTrancheId(e.target.value)}>
              {tranches.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.startTime} - {t.endTime}
                </option>
              ))}
            </select>
          </section>
          <section className="field" style={{ flex: 1 }}>
            <label className="label">Motif</label>
            <input className="input" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Optionnel" />
          </section>
        </section>
        <button type="button" className="btn btn--primary" style={{ marginTop: 12 }} onClick={handleBlock} disabled={!trancheId}>
          Bloquer
        </button>
      </section>

      <section className="card">
        <section className="tableWrap">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Tranche</th>
                <th>Motif</th>
                <th>Actif</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blockages.map((b) => (
                <tr key={b.id}>
                  <td>{b.date}</td>
                  <td>{b.trancheTime}</td>
                  <td>{b.reason || '—'}</td>
                  <td>{b.active ? 'Oui' : 'Non'}</td>
                  <td>
                    {b.active ? (
                      <button
                        type="button"
                        className="btn btn--ghost"
                        disabled={actionId === b.id}
                        onClick={() => handleUnblock(b.id)}
                      >
                        Débloquer
                      </button>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {blockages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="muted">
                    Aucun blocage.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </section>
      </section>
    </section>
  );
}
