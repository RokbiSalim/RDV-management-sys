export const fallbackClients = [
  { id: 1, name: 'Marsa Maroc' },
  { id: 2, name: 'Port Services Maroc' },
  { id: 3, name: 'Atlantique Logistics' },
  { id: 4, name: 'Ocean Freight Maroc' },
];

export const fallbackContainers = [
  { id: 'local-1', reference: 'MSKU1234567', clientId: 1, clientName: 'Marsa Maroc' },
  { id: 'local-2', reference: 'TCLU7654321', clientId: 1, clientName: 'Marsa Maroc' },
  { id: 'local-3', reference: 'COSU9955441', clientId: 2, clientName: 'Port Services Maroc' },
];

export function normalizeContainer(container, clients = []) {
  const client =
    clients.find((item) => String(item.id) === String(container.clientId)) ||
    clients.find((item) => item.name === container.clientName);

  return {
    ...container,
    clientId: container.clientId ?? client?.id ?? '',
    clientName: container.clientName ?? client?.name ?? '-',
  };
}
