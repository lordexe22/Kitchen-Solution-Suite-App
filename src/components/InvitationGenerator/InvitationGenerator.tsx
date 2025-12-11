// src/components/InvitationGenerator/InvitationGenerator.tsx

import { useState, useEffect } from 'react';
import { useCompanies } from '../../hooks/useCompanies';
import { useBranches } from '../../hooks/useBranches';
import { createInvitation } from '../../services/invitations/invitations.services';
import type { 
  InvitationGeneratorProps, 
  InvitationResponse 
} from './InvitationGenerator.types';
import styles from './InvitationGenerator.module.css';

// #component InvitationGenerator - formulario para generar enlaces de invitación
/**
 * Componente que permite a los ownership generar enlaces de invitación
 * para empleados. Permite seleccionar empresa y sucursal, luego genera
 * una URL única que convierte al usuario registrado en empleado.
 * 
 * Flujo:
 * 1. Cargar lista de empresas del ownership
 * 2. Al seleccionar empresa, cargar sus sucursales
 * 3. Al hacer clic en generar, crear invitación en backend
 * 4. Mostrar URL generada con botón de copiar
 * 5. Notificar al componente padre mediante callback
 */
export const InvitationGenerator = ({ onInvitationGenerated }: InvitationGeneratorProps) => {
  // #state Form state - estado del formulario
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedInvitation, setGeneratedInvitation] = useState<InvitationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  // #end-state

  // #hook useCompanies - cargar empresas del ownership
  const { companies, isLoading: isLoadingCompanies, loadCompanies } = useCompanies();
  // #end-hook

  // #hook useBranches - cargar sucursales de la empresa seleccionada
  const { branches, isLoading: isLoadingBranches, loadBranches } = useBranches(
    selectedCompanyId || 0
  );
  // #end-hook

  // #step 1 - cargar empresas al montar el componente
  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);
  // #end-step

  // #step 2 - cargar sucursales cuando se selecciona una empresa
  useEffect(() => {
    if (selectedCompanyId) {
      loadBranches();
      setSelectedBranchId(null); // Reset branch selection
      setGeneratedInvitation(null); // Reset generated invitation
      setError(null);
    }
  }, [selectedCompanyId, loadBranches]);
  // #end-step

  // #function handleCompanyChange - maneja cambio de empresa seleccionada
  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const companyId = e.target.value ? parseInt(e.target.value, 10) : null;
    setSelectedCompanyId(companyId);
  };
  // #end-function

  // #function handleBranchChange - maneja cambio de sucursal seleccionada
  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const branchId = e.target.value ? parseInt(e.target.value, 10) : null;
    setSelectedBranchId(branchId);
  };
  // #end-function

  // #function handleGenerateInvitation - genera la invitación
  /**
   * Llama al backend para generar una nueva invitación
   * Valida que empresa y sucursal estén seleccionadas
   * Actualiza el estado con la URL generada o el error
   */
  const handleGenerateInvitation = async () => {
    if (!selectedCompanyId || !selectedBranchId) {
      setError('Debes seleccionar una empresa y una sucursal');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedInvitation(null);
    setIsCopied(false);

    try {
      const invitation = await createInvitation({
        companyId: selectedCompanyId,
        branchId: selectedBranchId,
      });

      setGeneratedInvitation(invitation);
      
      // Notificar al componente padre
      if (onInvitationGenerated) {
        onInvitationGenerated(invitation.invitationUrl);
      }
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err) || 'Error al generar la invitación';
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };
  // #end-function

  // #function getErrorMessage - obtiene mensaje de error seguro
  const getErrorMessage = (err: unknown): string | null => {
    if (typeof err === 'object' && err !== null) {
      const maybeAxios = err as { response?: { data?: { error?: string; message?: string } }; message?: string };
      return (
        maybeAxios.response?.data?.error ||
        maybeAxios.response?.data?.message ||
        maybeAxios.message ||
        null
      );
    }
    return null;
  };
  // #end-function
  // #function handleCopyUrl - copia la URL al portapapeles
  /**
   * Usa la API del navegador para copiar la URL de invitación
   * Muestra feedback visual durante 2 segundos
   */
  const handleCopyUrl = async () => {
    if (!generatedInvitation?.invitationUrl) return;

    try {
      await navigator.clipboard.writeText(generatedInvitation.invitationUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar URL:', err);
      setError('No se pudo copiar la URL al portapapeles');
    }
  };
  // #end-function

  // #function formatExpirationDate - formatea la fecha de expiración
  const formatExpirationDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  // #end-function

  // #section Loading state
  if (isLoadingCompanies) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <span>Cargando empresas...</span>
        </div>
      </div>
    );
  }
  // #end-section

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Generar Invitación de Empleado</h2>
      <p className={styles.subtitle}>
        Crea un enlace único para invitar a un nuevo empleado a una sucursal específica
      </p>

      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        {/* #section Company selector */}
        <div className={styles.formGroup}>
          <label htmlFor="company-select" className={styles.label}>
            Empresa
          </label>
          <select
            id="company-select"
            className={styles.select}
            value={selectedCompanyId || ''}
            onChange={handleCompanyChange}
            disabled={isGenerating}
          >
            <option value="">Selecciona una empresa</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>
        {/* #end-section */}

        {/* #section Branch selector */}
        <div className={styles.formGroup}>
          <label htmlFor="branch-select" className={styles.label}>
            Sucursal
          </label>
          <select
            id="branch-select"
            className={styles.select}
            value={selectedBranchId || ''}
            onChange={handleBranchChange}
            disabled={!selectedCompanyId || isLoadingBranches || isGenerating}
          >
            <option value="">
              {!selectedCompanyId
                ? 'Primero selecciona una empresa'
                : isLoadingBranches
                ? 'Cargando sucursales...'
                : 'Selecciona una sucursal'}
            </option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>
        {/* #end-section */}

        {/* #section Generate button */}
        <button
          type="button"
          className={styles.generateButton}
          onClick={handleGenerateInvitation}
          disabled={!selectedCompanyId || !selectedBranchId || isGenerating}
        >
          {isGenerating ? 'Generando...' : 'Generar Invitación'}
        </button>
        {/* #end-section */}
      </form>

      {/* #section Error display */}
      {error && <div className={styles.error}>{error}</div>}
      {/* #end-section */}

      {/* #section Generated invitation result */}
      {generatedInvitation && (
        <div className={styles.resultContainer}>
          <h3 className={styles.resultTitle}>¡Invitación Generada!</h3>
          <div className={styles.urlBox}>
            <input
              type="text"
              className={styles.urlInput}
              value={generatedInvitation.invitationUrl}
              readOnly
            />
            <button
              type="button"
              className={`${styles.copyButton} ${isCopied ? styles.copied : ''}`}
              onClick={handleCopyUrl}
            >
              {isCopied ? '✓ Copiado' : 'Copiar'}
            </button>
          </div>
          <p className={styles.expiresText}>
            Expira el: {formatExpirationDate(generatedInvitation.expiresAt)}
          </p>
        </div>
      )}
      {/* #end-section */}
    </div>
  );
};
// #end-component
