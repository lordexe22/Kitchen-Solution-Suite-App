/* src/pages/dashboard/Tools/QRCreatorPage.tsx */
import React, { useEffect, useRef, useState } from 'react';
import { useCompanies } from '../../../hooks/useCompanies';
import { useBranches } from '../../../hooks/useBranches';
import { useQRContainerRef, useBasicOptions, useQRCodeDownload } from '../../../modules/qrCreator/qrCreator.hooks';

export default function QRCreatorPage() {
  const { companies, loadCompanies } = useCompanies();
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const { qrContainerRef } = useQRContainerRef();
  const { data, setData, width, setWidth, height, setHeight, margin, setMargin } = useBasicOptions({ qrContainerRef });
  const { downloadQR } = useQRCodeDownload();

  const { branches, loadBranches } = useBranches(selectedCompany || 0);
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [tableNumber, setTableNumber] = useState<string>('');

  useEffect(() => { loadCompanies(); }, [loadCompanies]);
  useEffect(() => { if (selectedCompany) loadBranches(); }, [selectedCompany, loadBranches]);

  useEffect(() => {
    // Set initial QR size if not set
    if (!width) setWidth(300);
    if (!height) setHeight(300);
  }, []);

  const generateURL = () => {
    if (!selectedBranch || !tableNumber) return '';
    const origin = window.location.origin;
    return `${origin}/branch/${selectedBranch}/table/${encodeURIComponent(tableNumber)}`;
  };

  const handleGenerate = () => {
    const url = generateURL();
    if (!url) return;
    setData(url as any);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>QR Creator</h2>
      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ minWidth: 320 }}>
          <label>Compañía</label>
          <select value={selectedCompany ?? ''} onChange={(e) => setSelectedCompany(e.target.value ? Number(e.target.value) : null)}>
            <option value="">-- Seleccionar compañía --</option>
            {companies?.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
          </select>

          <label style={{ display: 'block', marginTop: 12 }}>Sucursal</label>
          <select value={selectedBranch ?? ''} onChange={(e) => setSelectedBranch(e.target.value ? Number(e.target.value) : null)}>
            <option value="">-- Seleccionar sucursal --</option>
            {branches?.map(b => (<option key={b.id} value={b.id}>{b.name}</option>))}
          </select>

          <label style={{ display: 'block', marginTop: 12 }}>Mesa / Identificador</label>
          <input value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} placeholder="Ej: 12" />

          <div style={{ marginTop: 12 }}>
            <button onClick={handleGenerate}>Generar QR</button>
            <button style={{ marginLeft: 8 }} onClick={() => downloadQR('png')}>Descargar PNG</button>
          </div>
        </div>

        <div>
          <div ref={qrContainerRef as any} style={{ width: 320, height: 320, background: '#fff', padding: 8 }} />
        </div>
      </div>
    </div>
  );
}
