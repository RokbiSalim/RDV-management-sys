/** Contenu encodé dans le QR code d'un rendez-vous approuvé. */
export function buildRdvQrValue(rdv) {
  if (!rdv) return '';
  return JSON.stringify({
    type: 'RDV_MARSA',
    id: rdv.id,
    code: rdv.qrCode,
    container: rdv.containerReference,
    client: rdv.clientName,
    date: rdv.date,
    tranche: rdv.trancheTime,
    transporter: rdv.transporterName,
    plate: rdv.truckPlate,
    cin: rdv.cin,
  });
}

export function isApprovedRdv(rdv) {
  const s = String(rdv?.statut || '').toUpperCase();
  return s === 'CONFIRMED';
}
