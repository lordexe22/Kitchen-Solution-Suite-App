/* src/components/SocialRow/SocialRow.tsx */
// #section imports
import { useState, useEffect } from 'react';
import type { BranchWithLocation, BranchSocial, SocialPlatform, BranchSocialFormData } from '../../store/Branches.types';
import styles from './SocialRow.module.css';
import '/src/styles/button.css';
// #end-section

// #interface CopiedSocialsConfig
/**
 * Configuración copiada con el ID de la compañía para validar
 */
interface CopiedSocialsConfig {
  companyId: number;
  socials: BranchSocial[];
}
// #end-interface

// #interface SocialRowProps
interface SocialRowProps {
  /** Sucursal */
  branch: BranchWithLocation;
  /** ID de la compañía (para validar copiar/pegar) */
  companyId: number;
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
  /** Configuración copiada (estado global con companyId) */
  copiedConfig: CopiedSocialsConfig | null;
  /** Callback para actualizar configuración copiada */
  onCopyConfig: (config: CopiedSocialsConfig | null) => void;
  /** Indica si está cargando */
  isLoading?: boolean;
}
// #end-interface

// #variable PLATFORMS
/**
 * Plataformas de redes sociales con metadata.
 */
const PLATFORMS: Array<{ 
  value: SocialPlatform; 
  label: string; 
  iconPath: string;
  urlPattern: RegExp;
  placeholder: string;
}> = [
  { 
    value: 'facebook', 
    label: 'Facebook', 
    iconPath: `${import.meta.env.BASE_URL}facebook_icon.jpg`,
    urlPattern: /^https?:\/\/(www\.)?(facebook|fb)\.com\/.+/i,
    placeholder: 'https://facebook.com/tuempresa'
  },
  { 
    value: 'instagram', 
    label: 'Instagram', 
    iconPath: `${import.meta.env.BASE_URL}instagram_icon.jpg`,
    urlPattern: /^https?:\/\/(www\.)?instagram\.com\/.+/i,
    placeholder: 'https://instagram.com/tuempresa'
  },
  { 
    value: 'x', 
    label: 'X', 
    iconPath: `${import.meta.env.BASE_URL}x_icon.jpg`,
    urlPattern: /^https?:\/\/(www\.)?(twitter|x)\.com\/.+/i,
    placeholder: 'https://x.com/tuempresa'
  },
  { 
    value: 'tiktok', 
    label: 'TikTok', 
    iconPath: `${import.meta.env.BASE_URL}tiktok_icon.jpg`,
    urlPattern: /^https?:\/\/(www\.)?tiktok\.com\/@.+/i,
    placeholder: 'https://tiktok.com/@tuempresa'
  },
  { 
    value: 'youtube', 
    label: 'YouTube', 
    iconPath: `${import.meta.env.BASE_URL}youtube_icon.jpg`,
    urlPattern: /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/i,
    placeholder: 'https://youtube.com/@tuempresa'
  },
  { 
    value: 'whatsapp', 
    label: 'WhatsApp', 
    iconPath: `${import.meta.env.BASE_URL}whatsapp_icon.jpg`,
    urlPattern: /^\+?[1-9]\d{1,14}$/,
    placeholder: '+5491123456789'
  },
];
// #end-variable

// #component SocialRow
/**
 * Componente que muestra una lista de redes sociales editables inline.
 * Permite editar cada red social con validación en tiempo real.
 */
const SocialRow = ({ 
  branch,
  companyId,
  socials, 
  onUpdateSocials, 
  onCreateSocial,
  onUpdateSocial,
  onDeleteSocial,
  copiedConfig,
  onCopyConfig,
  isLoading 
}: SocialRowProps) => {
  // #state [editingValues, setEditingValues]
  /**
   * Almacena los valores temporales mientras el usuario edita.
   * Formato: { platform: { value: string, isValid: boolean, isDirty: boolean, isSaved: boolean } }
   */
  const [editingValues, setEditingValues] = useState<Record<string, { 
    value: string; 
    isValid: boolean; 
    isDirty: boolean;
    isSaved: boolean;
  }>>({});
  // #end-state

  // #state [savingPlatform, setSavingPlatform]
  const [savingPlatform, setSavingPlatform] = useState<SocialPlatform | null>(null);
  // #end-state

  // #effect - Initialize editing values from socials
  useEffect(() => {
    const initialValues: Record<string, { value: string; isValid: boolean; isDirty: boolean; isSaved: boolean }> = {};
    
    PLATFORMS.forEach(platform => {
      const social = socials.find(s => s.platform === platform.value);
      initialValues[platform.value] = {
        value: social?.url || '',
        isValid: social?.url ? platform.urlPattern.test(social.url) : true,
        isDirty: false,
        isSaved: !!social
      };
    });
    
    setEditingValues(initialValues);
  }, [socials]);
  // #end-effect

  // #function getSocialForPlatform
  /**
   * Obtiene la red social existente para una plataforma.
   */
  const getSocialForPlatform = (platform: SocialPlatform): BranchSocial | undefined => {
    return socials.find(s => s.platform === platform);
  };
  // #end-function

  // #function handleInputChange
  /**
   * Maneja el cambio en el input de una red social.
   * Valida la URL en tiempo real.
   */
  const handleInputChange = (platform: SocialPlatform, value: string) => {
    const platformInfo = PLATFORMS.find(p => p.value === platform);
    if (!platformInfo) return;

    const isValid = value.trim() === '' || platformInfo.urlPattern.test(value);

    setEditingValues(prev => ({
      ...prev,
      [platform]: {
        value,
        isValid,
        isDirty: true,
        isSaved: false
      }
    }));
  };
  // #end-function

  // #function handleSave
  /**
   * Guarda los cambios de una red social específica.
   */
  const handleSave = async (platform: SocialPlatform) => {
    const editingValue = editingValues[platform];
    if (!editingValue || !editingValue.isValid || !editingValue.isDirty) return;

    setSavingPlatform(platform);

    try {
      const existingSocial = getSocialForPlatform(platform);
      const url = editingValue.value.trim();

      if (url === '') {
        // Eliminar si existe y el input está vacío
        if (existingSocial) {
          await onDeleteSocial(branch.id, existingSocial.id);
          const updatedSocials = socials.filter(s => s.id !== existingSocial.id);
          await onUpdateSocials(branch.id, updatedSocials);
        }
      } else {
        // Crear o actualizar - IMPORTANTE: enviar 'twitter' correctamente
        const socialData: BranchSocialFormData = {
          platform, // Esto enviará 'twitter' correctamente
          url
        };

        let updatedSocials = [...socials];

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

        await onUpdateSocials(branch.id, updatedSocials);
      }

      // Marcar como guardado
      setEditingValues(prev => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          isDirty: false,
          isSaved: url !== ''
        }
      }));

    } catch (error) {
      console.error('Error saving social:', error);
      alert(error instanceof Error ? error.message : 'Error al guardar');
    } finally {
      setSavingPlatform(null);
    }
  };
  // #end-function

  // #function handleDelete
  /**
   * Elimina una red social.
   */
  const handleDelete = async (platform: SocialPlatform) => {
    const existingSocial = getSocialForPlatform(platform);
    if (!existingSocial) return;

    if (!confirm(`¿Eliminar ${PLATFORMS.find(p => p.value === platform)?.label}?`)) return;

    try {
      await onDeleteSocial(branch.id, existingSocial.id);
      const updatedSocials = socials.filter(s => s.id !== existingSocial.id);
      await onUpdateSocials(branch.id, updatedSocials);

      // Limpiar el input
      setEditingValues(prev => ({
        ...prev,
        [platform]: {
          value: '',
          isValid: true,
          isDirty: false,
          isSaved: false
        }
      }));
    } catch (error) {
      console.error('Error deleting social:', error);
      alert(error instanceof Error ? error.message : 'Error al eliminar');
    }
  };
  // #end-function

  // #function handleCopyConfig
  /**
   * Copia la configuración de redes sociales (actualiza estado global con companyId).
   */
  const handleCopyConfig = () => {
    if (socials.length === 0) {
      alert('No hay redes sociales configuradas para copiar');
      return;
    }

    onCopyConfig({ companyId, socials: [...socials] });
    alert(`✓ Configuración copiada (${socials.length} redes sociales)\n\nAhora puedes pegarla en cualquier otra sucursal de esta compañía.`);
  };
  // #end-function

  // #function handlePasteConfig
  /**
   * Pega la configuración copiada en esta sucursal.
   * Solo funciona si la config es de la misma compañía.
   */
  const handlePasteConfig = async () => {
    if (!copiedConfig || copiedConfig.socials.length === 0) {
      alert('No hay configuración copiada');
      return;
    }

    // Validar que sea de la misma compañía
    if (copiedConfig.companyId !== companyId) {
      alert('No puedes pegar configuración de otra compañía');
      return;
    }

    if (!confirm(`¿Aplicar ${copiedConfig.socials.length} redes sociales a esta sucursal?\n\nEsto reemplazará la configuración actual.`)) {
      return;
    }

    try {
      // Eliminar todas las redes sociales actuales
      await Promise.all(
        socials.map(social => onDeleteSocial(branch.id, social.id))
      );

      // Crear las nuevas redes sociales
      const newSocials: BranchSocial[] = [];
      for (const social of copiedConfig.socials) {
        const created = await onCreateSocial(branch.id, {
          platform: social.platform,
          url: social.url
        });
        newSocials.push(created);
      }

      await onUpdateSocials(branch.id, newSocials);
      alert('✓ Configuración aplicada exitosamente');
    } catch (error) {
      console.error('Error pasting config:', error);
      alert(error instanceof Error ? error.message : 'Error al aplicar configuración');
    }
  };
  // #end-function

  // #section return
  return (
    <div className={styles.container}>
      {/* #section Social list */}
      <div className={styles.socialsList}>
        {PLATFORMS.map(platform => {
          const editingValue = editingValues[platform.value] || { value: '', isValid: true, isDirty: false, isSaved: false };
          const existingSocial = getSocialForPlatform(platform.value);
          const isSaving = savingPlatform === platform.value;
          const showSaveButton = editingValue.isDirty && editingValue.isValid && editingValue.value.trim() !== '';
          const showDeleteButton = existingSocial && !editingValue.isDirty;

          return (
            <div key={platform.value} className={styles.socialRow}>
              {/* #section Left side: Icon + Label */}
              <div className={styles.socialLabel}>
                <img 
                  src={platform.iconPath} 
                  alt={platform.label}
                  className={styles.socialIcon}
                />
                <span className={styles.labelText}>{platform.label}</span>
              </div>
              {/* #end-section */}

              {/* #section Right side: Input + Actions + Error */}
              <div className={styles.socialInputWrapper}>
                <div className={styles.inputRow}>
                  <input
                    type="text"
                    className={`${styles.socialInput} ${
                      !editingValue.isValid ? styles.inputInvalid : 
                      editingValue.isSaved && !editingValue.isDirty ? styles.inputSaved : ''
                    }`}
                    value={editingValue.value}
                    onChange={(e) => handleInputChange(platform.value, e.target.value)}
                    placeholder={platform.placeholder}
                    disabled={isLoading || isSaving}
                  />

                  {/* #section Action buttons */}
                  <div className={styles.socialActions}>
                    {showSaveButton && (
                      <button
                        className={`btn-pri btn-sm ${styles.saveButton}`}
                        onClick={() => handleSave(platform.value)}
                        disabled={isSaving}
                        title="Guardar cambios"
                      >
                        {isSaving ? '⏳' : '✓'}
                      </button>
                    )}

                    {showDeleteButton && (
                      <button
                        className={`btn-danger btn-sm ${styles.deleteButton}`}
                        onClick={() => handleDelete(platform.value)}
                        disabled={isLoading}
                        title={`Eliminar ${platform.label}`}
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                  {/* #end-section */}
                </div>

                {/* #section Error message */}
                {!editingValue.isValid && editingValue.value.trim() !== '' && (
                  <span className={styles.errorMessage}>
                    URL inválida
                  </span>
                )}
                {/* #end-section */}
              </div>
              {/* #end-section */}
            </div>
          );
        })}
      </div>
      {/* #end-section */}

      {/* #section Footer with copy/paste buttons */}
      <div className={styles.footer}>
        <button
          className="btn-sec btn-sm"
          onClick={handleCopyConfig}
          disabled={isLoading || socials.length === 0}
          title="Copiar configuración de esta sucursal"
        >
          📋 Copiar configuración
        </button>
        
        {copiedConfig && copiedConfig.socials.length > 0 && copiedConfig.companyId === companyId && (
          <button
            className="btn-pri btn-sm"
            onClick={handlePasteConfig}
            disabled={isLoading}
            title="Pegar configuración copiada"
          >
            📥 Pegar configuración ({copiedConfig.socials.length})
          </button>
        )}
      </div>
      {/* #end-section */}
    </div>
  );
  // #end-section
};

export default SocialRow;
// #end-component