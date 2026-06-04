import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { buildRdvQrValue } from '../utils/rdvQr.js';

export default function RdvQrCode({ rdv, size = 160 }) {
  const [dataUrl, setDataUrl] = useState('');

  useEffect(() => {
    if (!rdv?.qrCode) {
      setDataUrl('');
      return;
    }
    let cancelled = false;
    QRCode.toDataURL(buildRdvQrValue(rdv), { width: size, margin: 1 })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setDataUrl('');
      });
    return () => {
      cancelled = true;
    };
  }, [rdv, size]);

  if (!dataUrl) return null;

  return (
    <img
      src={dataUrl}
      alt={`QR rendez-vous ${rdv.id}`}
      width={size}
      height={size}
      style={{ display: 'block' }}
    />
  );
}
