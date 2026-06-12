import { useCallback, useEffect, useMemo, useState } from 'react';
import ContainerFormModal from '../../components/containers/ContainerFormModal.jsx';
import ContainerTable from '../../components/containers/ContainerTable.jsx';
import { clientService } from '../../services/clientservice.js';
import { containerService } from '../../services/containerservice.js';
import {
  fallbackClients,
  fallbackContainers,
  normalizeContainer,
} from '../../data/containerCrudFallback.js';

function buildContainerFromPayload(payload, clients, currentContainer) {
  const client = clients.find((item) => Number(item.id) === Number(payload.clientId));

  return {
    id: currentContainer?.id || `local-${Date.now()}`,
    reference: payload.reference,
    clientId: payload.clientId,
    clientName: client?.name || currentContainer?.clientName || '-',
  };
}

export default function AdminContainersPage() {
  const [containers, setContainers] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [modalState, setModalState] = useState({ open: false, mode: 'add', container: null });

  const visibleContainers = useMemo(
    () => containers.map((container) => normalizeContainer(container, clients)),
    [containers, clients],
  );

  const loadData = useCallback(() => {
    setLoading(true);
    setError(null);

    return Promise.allSettled([containerService.getAll(), clientService.getAll()])
      .then(([containersResult, clientsResult]) => {
        const nextClients =
          clientsResult.status === 'fulfilled'
            ? clientsResult.value.data || []
            : fallbackClients;

        const nextContainers =
          containersResult.status === 'fulfilled'
            ? containersResult.value.data || []
            : fallbackContainers;

        setClients(nextClients);
        setContainers(nextContainers.map((container) => normalizeContainer(container, nextClients)));

        if (containersResult.status === 'rejected' || clientsResult.status === 'rejected') {
          setNotice('Mode local actif: certaines donnees viennent du fallback.');
        }
      })
      .catch((err) => {
        setError(err.message || 'Unable to load containers.');
        setClients(fallbackClients);
        setContainers(fallbackContainers);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openAddModal = () => {
    setModalState({ open: true, mode: 'add', container: null });
    setError(null);
  };

  const openEditModal = (container) => {
    setModalState({ open: true, mode: 'edit', container });
    setError(null);
  };

  const closeModal = () => {
    if (saving) return;
    setModalState({ open: false, mode: 'add', container: null });
  };

  const saveContainer = async (payload) => {
    setSaving(true);
    setError(null);
    setNotice(null);

    const currentContainer = modalState.container;
    const localContainer = buildContainerFromPayload(payload, clients, currentContainer);

    try {
      if (modalState.mode === 'edit' && currentContainer) {
        const response = await containerService.update(currentContainer.id, payload);
        const updated = normalizeContainer(response.data || localContainer, clients);
        setContainers((items) => items.map((item) => (item.id === currentContainer.id ? updated : item)));
        setNotice('Conteneur modifie avec succes.');
      } else {
        const response = await containerService.create(payload);
        const created = normalizeContainer(response.data || localContainer, clients);
        setContainers((items) => [created, ...items]);
        setNotice('Conteneur ajoute avec succes.');
      }
    } catch {
      if (modalState.mode === 'edit' && currentContainer) {
        setContainers((items) => items.map((item) => (item.id === currentContainer.id ? localContainer : item)));
        setNotice('Modification appliquee localement. API update indisponible.');
      } else {
        setContainers((items) => [localContainer, ...items]);
        setNotice('Ajout applique localement. API create indisponible.');
      }
    } finally {
      setSaving(false);
      setModalState({ open: false, mode: 'add', container: null });
    }
  };

  const deleteContainer = async (container) => {
    const confirmed = window.confirm(`Supprimer le conteneur ${container.reference} ?`);
    if (!confirmed) return;

    setBusyId(container.id);
    setError(null);
    setNotice(null);

    try {
      await containerService.delete(container.id);
      setNotice('Conteneur supprime avec succes.');
    } catch {
      setNotice('Suppression appliquee localement. API delete indisponible.');
    } finally {
      setContainers((items) => items.filter((item) => item.id !== container.id));
      setBusyId(null);
    }
  };

  if (loading) {
    return <div>Loading containers...</div>;
  }

  return (
    <div className="containersPage">
      <div className="pageHeader">
        <div>
          <p className="pageEyebrow">Marsa Maroc</p>
          <h1 className="pageTitle">Manage Containers</h1>
        </div>
        <button type="button" className="btn btn--primary" onClick={openAddModal}>
          <span aria-hidden="true">➕</span>
          Add Container
        </button>
      </div>

      {error ? <div className="callout callout--danger">{error}</div> : null}
      {notice ? <div className="callout callout--success">{notice}</div> : null}

      <section className="card containersCard">
        <ContainerTable
          containers={visibleContainers}
          onEdit={openEditModal}
          onDelete={deleteContainer}
          busyId={busyId}
        />
      </section>

      {modalState.open ? (
        <ContainerFormModal
          mode={modalState.mode}
          container={modalState.container}
          clients={clients}
          onClose={closeModal}
          onSubmit={saveContainer}
          saving={saving}
        />
      ) : null}
    </div>
  );
}
