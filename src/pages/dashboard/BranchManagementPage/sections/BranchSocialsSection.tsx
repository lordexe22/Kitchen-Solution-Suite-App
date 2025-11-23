// src/pages/dashboard/BranchManagementPage/sections/BranchSocialsSection.tsx

import { useEffect, useState } from 'react';
import BranchAccordion from '../../../../components/BranchAccordion/BranchAccordion';
import SocialRow from '../../../../components/SocialRow/SocialRow';
import { useBranches } from '../../../../hooks/useBranches';
import type { BranchSocial } from '../../../../store/Branches.types';
import type { BranchSectionProps } from '../BranchManagementPage.types';
import styles from '../BranchManagementPage.module.css';

// #interface CopiedSocialsConfig
/**
 * Configuración copiada con el ID de la compañía para validar
 */
interface CopiedSocialsConfig {
  companyId: number;
  socials: BranchSocial[];
}
// #end-interface

interface BranchSocialsSectionProps extends BranchSectionProps {
  copiedConfig?: CopiedSocialsConfig | null;
  onCopyConfig?: (config: CopiedSocialsConfig | null) => void;
}

// #component BranchSocialsSection
/**
 * Componente que maneja la sección de redes sociales de sucursales.
 * Carga branches, socials y renderiza BranchAccordion expandibles.
 */
const BranchSocialsSection = ({
  companyId,
  onError = () => {},
  copiedConfig = null,
  onCopyConfig = () => {},
}: BranchSocialsSectionProps) => {
  // #hook useBranches
  const {
    branches,
    isLoading,
    loadBranches,
    loadBranchSocials,
    createSocial,
    updateSocial,
    deleteSocial,
    updateBranchSocials,
  } = useBranches(companyId);
  // #end-hook

  // #state [branchSocialsMap, setBranchSocialsMap]
  const [branchSocialsMap, setBranchSocialsMap] = useState<Map<number, BranchSocial[]>>(new Map());
  // #end-state

  // #state [isLoadingSocials, setIsLoadingSocials]
  const [isLoadingSocials, setIsLoadingSocials] = useState(false);
  // #end-state

  // #state [loadingBranchId, setLoadingBranchId]
  const [loadingBranchId, setLoadingBranchId] = useState<number | null>(null);
  // #end-state

  // #effect - Load branches on mount
  useEffect(() => {
    loadBranches();
  }, [loadBranches]);
  // #end-effect

  // #effect - Load socials when branches are available
  useEffect(() => {
    if (branches.length > 0 && !isLoadingSocials) {
      const needsSocials = branches.some((branch) => !branchSocialsMap.has(branch.id));

      if (needsSocials) {
        setIsLoadingSocials(true);

        Promise.all(
          branches.map(async (branch) => {
            if (!branchSocialsMap.has(branch.id)) {
              try {
                const socials = await loadBranchSocials(branch.id);
                setBranchSocialsMap((prev) => new Map(prev).set(branch.id, socials));
                updateBranchSocials(branch.id, socials);
              } catch (err) {
                console.error(`Error loading socials for branch ${branch.id}:`, err);
              }
            }
          })
        ).finally(() => {
          setIsLoadingSocials(false);
        });
      }
    }
  }, [branches, loadBranchSocials, updateBranchSocials, isLoadingSocials, branchSocialsMap]);
  // #end-effect

  // #event handleUpdateSocials
  const handleUpdateSocials = async (branchId: number, socials: BranchSocial[]) => {
    setLoadingBranchId(branchId);
    onError('');

    try {
      // Actualizar en el mapa local
      setBranchSocialsMap((prev) => new Map(prev).set(branchId, socials));
      updateBranchSocials(branchId, socials);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al guardar redes sociales';
      onError(errorMessage);
    } finally {
      setLoadingBranchId(null);
    }
  };
  // #end-event

  // #section return
  return (
    <>
      <div className={styles.branchesSection}>
        {/* #section Header */}
        <div className={styles.branchesHeader}>
          <h4 className={styles.sectionTitle}>Sucursales</h4>
        </div>
        {/* #end-section */}

        {/* #section Loading state */}
        {(isLoading || isLoadingSocials) && branches.length === 0 && (
          <p className={styles.loading}>Cargando redes sociales...</p>
        )}
        {/* #end-section */}

        {/* #section Empty state */}
        {!isLoading && !isLoadingSocials && branches.length === 0 && (
          <p className={styles.emptyMessage}>No hay sucursales en esta compañía.</p>
        )}
        {/* #end-section */}

        {/* #section Branch list */}
        {branches.length > 0 && (
          <div className={styles.branchList}>
            {branches.map((branch, index) => (
              <BranchAccordion
                key={branch.id}
                branch={branch}
                displayIndex={index + 1}
                expandable={true}
              >
                <SocialRow
                  branch={branch}
                  companyId={companyId}
                  socials={branchSocialsMap.get(branch.id) || []}
                  onUpdateSocials={handleUpdateSocials}
                  onCreateSocial={createSocial}
                  onUpdateSocial={updateSocial}
                  onDeleteSocial={deleteSocial}
                  copiedConfig={copiedConfig}
                  onCopyConfig={onCopyConfig}
                  isLoading={loadingBranchId === branch.id}
                />
              </BranchAccordion>
            ))}
          </div>
        )}
        {/* #end-section */}
      </div>
    </>
  );
};

export default BranchSocialsSection;
