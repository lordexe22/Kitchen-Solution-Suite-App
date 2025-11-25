/* src/pages/dashboard/Tools/QRCreatorPage.tsx */
import { useEffect, useState } from 'react';
import { useCompanies } from '../../../hooks/useCompanies';
import { useBranches } from '../../../hooks/useBranches';
import QRCreator from '../../../modules/qrCreator/qrCreator';
import styles from './QRCreatorPage.module.css';

export default function QRCreatorPage() {
  // #hooks - Gestión de compañías y sucursales
  const { companies, loadCompanies } = useCompanies();
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const { branches, loadBranches } = useBranches(selectedCompany || 0);
  // #end-hooks

  // #state - Datos para generar URL del QR
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [tableNumber, setTableNumber] = useState<string>('');
  const [generatedURL, setGeneratedURL] = useState<string>('');
  // #end-state

  // #effect - Cargar compañías al montar
  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);
  // #end-effect

  // #effect - Cargar sucursales cuando se selecciona una compañía
  useEffect(() => {
    if (selectedCompany) {
      loadBranches();
      // Reset sucursal seleccionada cuando cambia la compañía
      setSelectedBranch(null);
    }
  }, [selectedCompany, loadBranches]);
  // #end-effect

  // #function generateURL
  /**
   * Genera la URL del QR basada en la sucursal y número de mesa.
   */
  const generateURL = () => {
    if (!selectedBranch || !tableNumber) return '';
    const origin = window.location.origin;
    return `${origin}/branch/${selectedBranch}/table/${encodeURIComponent(tableNumber)}`;
  };
  // #end-function

  // #function handleGenerate
  /**
   * Handler para el botón "Generar QR".
   * Valida los datos y genera la URL.
   */
  const handleGenerate = () => {
    const url = generateURL();
    if (!url) {
      alert('Por favor selecciona una sucursal e ingresa un número de mesa');
      return;
    }
    setGeneratedURL(url);
  };
  // #end-function

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>QR Creator</h2>
      
      {/* #section Controles de generación de URL */}
      <div className={styles.urlControls}>
        <div className={styles.controlGroup}>
          <label className={styles.label}>Compañía</label>
          <select 
            className={styles.select}
            value={selectedCompany ?? ''} 
            onChange={(e) => setSelectedCompany(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">-- Seleccionar compañía --</option>
            {companies?.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.label}>Sucursal</label>
          <select 
            className={styles.select}
            value={selectedBranch ?? ''} 
            onChange={(e) => setSelectedBranch(e.target.value ? Number(e.target.value) : null)}
            disabled={!selectedCompany}
          >
            <option value="">-- Seleccionar sucursal --</option>
            {branches?.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.label}>Número de Mesa</label>
          <input 
            type="text" 
            className={styles.input}
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            placeholder="Ej: 1, A1, Mesa 5"
          />
        </div>

        <button 
          className={styles.generateButton}
          onClick={handleGenerate}
          disabled={!selectedBranch || !tableNumber}
        >
          Generar QR
        </button>
      </div>
      {/* #end-section */}

      {/* #section URL generada (preview) */}
      {generatedURL && (
        <div className={styles.urlPreview}>
          <strong>URL generada:</strong> 
          <code className={styles.urlCode}>{generatedURL}</code>
        </div>
      )}
      {/* #end-section */}

      {/* #section Módulo QR Creator */}
      <div className={styles.qrCreatorWrapper}>
        <QRCreator data={generatedURL} />
      </div>
      {/* #end-section */}
    </div>
  );
}