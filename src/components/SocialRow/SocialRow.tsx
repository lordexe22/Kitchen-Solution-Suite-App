/* src/components/SocialRow/SocialRow.tsx */
// #section imports
import { useState, useRef } from 'react';
import type { BranchWithLocation, BranchSocial, SocialPlatform, BranchSocialFormData } from '../../store/Branches.types';
import SocialEditor from '../SocialEditor';
import styles from './SocialRow.module.css';
import '/src/styles/button.css';
// #end-section

// #interface SocialRowProps
interface SocialRowProps {
  /** Sucursal */
  branch: BranchWithLocation;
  /** Redes sociales de la sucursal */
  socials: BranchSocial[];
  /** Callback al actualizar redes sociales */
  onUpdateSocials: (branchId: number, socials: BranchSocial[]) => Promise<void>;
  /** Callback al crear red social */
  onCreateSocial: (branchId: number, data: BranchSocialFormData) => Promise<BranchSocial>;
  /** Callback al actualizar red social */
  onUpdateSocial: (branchId: number, socialId: number, data: BranchSocialFormData) => Promise<BranchSocial>;
  /** Callback al eliminar red social */
  onDeleteSocial: (branchId: number, socialId: number) => Promise<void>;
  /** Callback al aplicar a todas */
  onApplyToAll: (branchId: number) => Promise<void>;
  /** Indica si está cargando */
  isLoading?: boolean;
}
// #end-interface

// #variable PLATFORMS
/**
 * Plataformas principales a mostrar en columnas.
 */
const PLATFORMS: Array<{ value: SocialPlatform; icon: string; label: string }> = [
  { value: 'facebook', icon: '📘', label: 'Facebook' },
  { value: 'instagram', icon: '📷', label: 'Instagram' },
  { value: 'twitter', icon: '🐦', label: 'Twitter' },
  { value: 'linkedin', icon: '💼', label: 'LinkedIn' },
  { value: 'tiktok', icon: '🎵', label: 'TikTok' },
  { value: 'whatsapp', icon: '💬', label: 'WhatsApp' },
];
// #end-variable

// #component SocialRow
/**
 * Componente que muestra una fila con las redes sociales de una sucursal.
 * Permite editar cada red social individualmente.
 */
const SocialRow = ({ 
  branch, 
  socials, 
  onUpdateSocials, 
  onCreateSocial,
  onUpdateSocial,
  onDeleteSocial,
  onApplyToAll, 
  isLoading 
}: SocialRowProps) => {
  const [editingPlatform, setEditingPlatform] = useState<SocialPlatform | null>(null);
  const [editorPosition, setEditorPosition] = useState<{ top: number; left: number } | undefined>();
  const cellRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // #function getSocialForPlatform
  /**
   * Obtiene la red social de una plataforma específica.
   */
  const getSocialForPlatform = (platform: SocialPlatform): BranchSocial | undefined => {
    return socials.find(s => s.platform === platform);
  };
  // #end-function

  // #function handleCellClick
  /**
   * Maneja el click en una celda de plataforma.
   */
  const handleCellClick = (platform: SocialPlatform) => {
    const cellElement = cellRefs.current[platform];
    if (cellElement) {
      const rect = cellElement.getBoundingClientRect();
      setEditorPosition({
        top: rect.bottom + 8,
        left: rect.left
      });
    }
    setEditingPlatform(platform);
  };
  // #end-function

  // #function handleSaveSocial
  /**
   * Guarda la red social editada.
   */
  const handleSaveSocial = async (data: { url: string | null }) => {
    if (!editingPlatform) return;

    try {
      const existingSocial = getSocialForPlatform(editingPlatform);
      let updatedSocials = [...socials];

      if (data.url === null || data.url.trim() === '') {
        // Eliminar si existe
        if (existingSocial) {
          await onDeleteSocial(branch.id, existingSocial.id);
          updatedSocials = updatedSocials.filter(s => s.id !== existingSocial.id);
        }
      } else {
        // Crear o actualizar
        const socialData: BranchSocialFormData = {
          platform: editingPlatform,
          url: data.url
        };

        if (existingSocial) {
          // Actualizar existente
          const updated = await onUpdateSocial(branch.id, existingSocial.id, socialData);
          updatedSocials = updatedSocials.map(s => 
            s.id === existingSocial.id ? updated : s
          );
        } else {
          // Crear nuevo
          const newSocial = await onCreateSocial(branch.id, socialData);
          updatedSocials.push(newSocial);
        }
      }

      await onUpdateSocials(branch.id, updatedSocials);
      setEditingPlatform(null);
    } catch (error) {
      console.error('Error saving social:', error);
      alert(error instanceof Error ? error.message : 'Error al guardar');
    }
  };
  // #end-function

  // #function handleApplyToAll
  /**
   * Aplica las redes sociales de esta sucursal a todas.
   */
  const handleApplyToAll = async () => {
    if (socials.length === 0) {
      alert('No hay redes sociales configuradas para aplicar');
      return;
    }

    if (confirm('¿Aplicar estas redes sociales a todas las sucursales de la empresa?\n\nEsto reemplazará las redes sociales existentes.')) {
      await onApplyToAll(branch.id);
    }
  };
  // #end-function

  return (
    <>
      <div className={styles.row}>
        {/* Columna: Nombre de sucursal */}
        <div className={styles.branchInfo}>
          <span className={styles.branchName}>
            📍 {branch.name || `Sucursal #${branch.id}`}
          </span>
          {branch.location && (
            <span className={styles.branchLocation}>
              {branch.location.city}, {branch.location.state}
            </span>
          )}
        </div>

        {/* Columnas: Plataformas */}
        {PLATFORMS.map(platform => {
          const social = getSocialForPlatform(platform.value);
          const hasUrl = social && social.url;
          
          return (
            <div
              key={platform.value}
              ref={el => { 
                if (el) cellRefs.current[platform.value] = el;
              }}
              className={`${styles.platformCell} ${hasUrl ? styles.platformConfigured : styles.platformEmpty}`}
              onClick={() => !isLoading && handleCellClick(platform.value)}
              title={hasUrl ? `${platform.label}: ${social.url}` : `Click para configurar ${platform.label}`}
            >
              <span className={styles.platformIcon}>{platform.icon}</span>
              {hasUrl && <span className={styles.checkmark}>✓</span>}
            </div>
          );
        })}

        {/* Columna: Acciones */}
        <div className={styles.actions}>
          <button
            className="btn-sec btn-xs"
            onClick={handleApplyToAll}
            disabled={isLoading || socials.length === 0}
            title="Aplicar estas redes sociales a todas las sucursales"
          >
            📢 Aplicar a todas
          </button>
        </div>
      </div>

      {/* Editor de red social */}
      {editingPlatform && (
        <SocialEditor
          platform={editingPlatform}
          social={getSocialForPlatform(editingPlatform)}
          onSave={handleSaveSocial}
          onCancel={() => setEditingPlatform(null)}
          position={editorPosition}
        />
      )}
    </>
  );
};

export default SocialRow;
// #end-component