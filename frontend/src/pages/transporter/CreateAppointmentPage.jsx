import { useEffect, useMemo, useState } from 'react';
import { useRole } from '../../context/roleContext.jsx';
import { containerService } from '../../services/containerservice.js';
import { trancheService } from '../../services/trancheservice.js';
import { rdvService } from '../../services/rdvservice.js';
import { getCurrentUserId } from '../../utils/session.js';
import { statusLabel } from '../../utils/format.js';
import { Table, Th, Td } from '../../components/TableParts.jsx';

export default function CreateAppointmentPage() {
  const { username } = useRole();
  const [containers, setContainers] = useState([]);
  const [tranches, setTranches] = useState([]);
  const [trancheAvailability, setTrancheAvailability] = useState([]);
  const [containerId, setContainerId] = useState('');
  const [trancheId, setTrancheId] = useState('');
  const [cin, setCin] = useState('');
  const [transporterName, setTransporterName] = useState('');
  const [truckPlate, setTruckPlate] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (username && !transporterName) setTransporterName(username);
  }, [username]);

  useEffect(() => {
    if (!date) return;
    let active = true;

    trancheService
      .getAvailability(date)
      .then((response) => {
        if (!active) return;
        setTrancheAvailability(response.data || []);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || 'Unable to load available tranches for the selected date.');
      });

    return () => {
      active = false;
    };
  }, [date]);

  useEffect(() => {
    let active = true;

    Promise.all([containerService.getAll(), trancheService.getAll()])
      .then(([containersRes, tranchesRes]) => {
        if (!active) return;
        const containerList = containersRes.data || [];
        const trancheList = tranchesRes.data || [];
        setContainers(containerList);
        setTranches(trancheList);
        setContainerId(containerList[0]?.id || '');
        setTrancheId(trancheList[0]?.id || '');
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || 'Unable to load appointment form data.');
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!trancheAvailability.length || !tranches.length) return;

    const availableIds = trancheAvailability
      .filter((item) => !item.blocked && item.remaining > 0)
      .map((item) => String(item.id));

    if (!trancheId || !availableIds.includes(trancheId)) {
      setTrancheId(availableIds[0] || trancheAvailability[0]?.id?.toString() || '');
    }
  }, [trancheAvailability, tranches, trancheId]);

  const availabilityMap = useMemo(() => {
    return Object.fromEntries(trancheAvailability.map((item) => [item.id, item]));
  }, [trancheAvailability]);

  const selectedContainer = useMemo(() => containers.find((c) => c.id === containerId), [containers, containerId]);
  const selectedTranche = useMemo(() => tranches.find((t) => t.id === trancheId), [tranches, trancheId]);
  const selectedAvailability = availabilityMap[Number(trancheId)];
  const slotUnavailable = selectedAvailability?.blocked || selectedAvailability?.remaining === 0;

  const createAppointment = async () => {
    if (slotUnavailable) {
      const message = selectedAvailability?.blocked
        ? 'Cette tranche est bloquée pour la date sélectionnée.'
        : 'Cette tranche est complète pour la date sélectionnée.';
      setError(message);
      return;
    }

    const payload = {
      cin,
      transporterName,
      truckPlate,
      date,
      trancheId: Number(trancheId),
      containerId: Number(containerId),
      createdById: getCurrentUserId() ?? 1,
    };

    try {
      const res = await rdvService.create(payload);
      setSubmitted(res.data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Unable to submit appointment.');
      setSubmitted(null);
    }
  };

  if (loading) {
    return <div>Loading appointment form...</div>;
  }

  return (
    <div>
      <h1 className="pageTitle">Create Appointment</h1>
      {error ? <div className="callout callout--danger">{error}</div> : null}

      <div className="card" style={{ textAlign: 'left' }}>
        <div className="filters" style={{ gap: 12 }}>
          <div className="field" style={{ flex: 1 }}>
            <label className="label">Container</label>
            <select className="input" value={containerId} onChange={(e) => setContainerId(e.target.value)}>
              {containers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.reference} {c.clientName ? `(${c.clientName})` : ''}
                </option>
              ))}
              {containers.length === 0 ? <option value="">No containers available</option> : null}
            </select>
          </div>

          <div className="field" style={{ flex: 1 }}>
            <label className="label">Tranche</label>
            <select className="input" value={trancheId} onChange={(e) => setTrancheId(e.target.value)}>
              {tranches.map((t) => {
                const availability = availabilityMap[t.id];
                let label = `${t.startTime} - ${t.endTime} (${t.quota})`;
                let disabled = false;

                if (availability) {
                  if (availability.blocked) {
                    label += ' — bloquée';
                    disabled = true;
                  } else if (availability.remaining === 0) {
                    label += ' — complète';
                    disabled = true;
                  } else {
                    label += ` — ${availability.remaining} libres`;
                  }
                }

                return (
                  <option key={t.id} value={t.id} disabled={disabled}>
                    {label}
                  </option>
                );
              })}
              {tranches.length === 0 ? <option value="">No tranches available</option> : null}
            </select>
          </div>
        </div>

        <div className="filters" style={{ gap: 12, marginTop: 12 }}>
          <div className="field" style={{ flex: 1 }}>
            <label className="label">CIN</label>
            <input className="input" value={cin} onChange={(e) => setCin(e.target.value)} placeholder="Client CIN" />
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label className="label">Transporter</label>
            <input className="input" value={transporterName} onChange={(e) => setTransporterName(e.target.value)} placeholder="Transporter name" />
          </div>
        </div>

        <div className="filters" style={{ gap: 12, marginTop: 12 }}>
          <div className="field" style={{ flex: 1 }}>
            <label className="label">Truck plate</label>
            <input className="input" value={truckPlate} onChange={(e) => setTruckPlate(e.target.value)} placeholder="Plate number" />
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label className="label">Date</label>
            <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>

        <div className="field" style={{ marginTop: 12 }}>
          <label className="label">Notes</label>
          <textarea
            className="input"
            style={{ minHeight: 90, resize: 'vertical' }}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional notes for admin review"
          />
        </div>

        <button
          className="btn btn--primary"
          style={{ marginTop: 12 }}
          onClick={createAppointment}
          disabled={slotUnavailable || !containerId || !trancheId || !cin || !transporterName || !truckPlate || !date}
        >
          Submit Request
        </button>

        {selectedAvailability ? (
          <div className="hint" style={{ marginTop: 10 }}>
            {selectedAvailability.blocked
              ? 'La tranche sélectionnée est bloquée pour cette date.'
              : selectedAvailability.remaining === 0
              ? 'La tranche sélectionnée est complète pour cette date.'
              : `Places restantes : ${selectedAvailability.remaining} / ${selectedAvailability.quota}`}
          </div>
        ) : null}

        <section style={{ marginTop: 24 }}>
          <h2 style={{ marginBottom: 12 }}>Créneaux disponibles</h2>
          <p style={{ marginBottom: 14, opacity: 0.85 }}>
            Consultez les créneaux libres avant de soumettre votre rendez-vous. Les créneaux bloqués ou complets ne sont pas sélectionnables.
          </p>
          <Table>
            <thead>
              <tr>
                <Th>Tranche</Th>
                <Th>Quota</Th>
                <Th>Réservé</Th>
                <Th>Restant</Th>
                <Th>Bloqué</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {tranches.map((t) => {
                const availability = availabilityMap[t.id];
                const status = availability
                  ? availability.blocked
                    ? 'Bloquée'
                    : availability.remaining === 0
                    ? 'Complète'
                    : 'Libre'
                  : 'Indisponible';
                const pillClass = availability
                  ? availability.blocked
                    ? 'pill pill--danger'
                    : availability.remaining === 0
                    ? 'pill pill--warning'
                    : 'pill pill--success'
                  : 'pill pill--neutral';

                return (
                  <tr key={t.id}>
                    <Td>{`${t.startTime} - ${t.endTime}`}</Td>
                    <Td>{t.quota}</Td>
                    <Td>{availability ? availability.booked : '-'}</Td>
                    <Td>{availability ? availability.remaining : '-'}</Td>
                    <Td>{availability?.blocked ? 'Oui' : 'Non'}</Td>
                    <Td>
                      <span className={pillClass}>{status}</span>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </section>

        {submitted ? (
          <div className="callout callout--success" style={{ marginTop: 12 }}>
            <div className="callout__title">Demande enregistrée — en attente d&apos;approbation admin</div>
            <div className="muted"></div>
            <ul className="rdvSummary" style={{ margin: '12px 0 0', paddingLeft: 18, textAlign: 'left' }}>
              <li>
                <strong>Statut :</strong>{' '}
                <span className={statusLabel(submitted.statut).className}>{statusLabel(submitted.statut).text}</span>
              </li>
              <li><strong>N° :</strong> {submitted.id}</li>
              <li><strong>Conteneur :</strong> {submitted.containerReference}</li>
              <li><strong>Client :</strong> {submitted.clientName}</li>
              <li><strong>Date :</strong> {submitted.date}</li>
              <li><strong>Tranche :</strong> {submitted.trancheTime}</li>
              <li><strong>Transporteur :</strong> {submitted.transporterName}</li>
              <li><strong>Plaque :</strong> {submitted.truckPlate}</li>
            </ul>
          </div>
        ) : null}

        {selectedContainer ? (
          <div className="hint" style={{ marginTop: 10 }}>
            Selected: <strong>{selectedContainer.reference}</strong>
          </div>
        ) : null}
        {selectedTranche ? (
          <div className="hint" style={{ marginTop: 10 }}>
            Tranche: <strong>{selectedTranche.startTime} - {selectedTranche.endTime}</strong>
          </div>
        ) : null}
      </div>
    </div>
  );
}

