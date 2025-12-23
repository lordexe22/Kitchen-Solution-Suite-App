/* src/components/BranchSocialsModal/BranchSocialsModal.tsx */
// #section imports
import { useState, useEffect, useCallback } from 'react';
import type { BranchWithLocation, BranchSocial, BranchSocialFormData } from '../../store/Branches.types';
import { SOCIAL_PLATFORMS } from '../../store/Branches.types';
import { useToast } from '../../hooks/useToast';
import styles from './BranchSocialsModal.module.css';
import '/src/styles/modal.css';
import '/src/styles/button.css';
// #end-section

// #interface BranchSocialsModalProps
interface BranchSocialsModalProps {
  branch: BranchWithLocation;
  companyId: number;
  totalBranches: number;
  onClose: () => void;
  onLoadSocials: (branchId: number) => Promise<BranchSocial[]>;
  onCreateSocial: (branchId: number, data: BranchSocialFormData) => Promise<BranchSocial>;
  onUpdateSocial: (branchId: number, socialId: number, data: BranchSocialFormData) => Promise<BranchSocial>;
  onDeleteSocial: (branchId: number, socialId: number) => Promise<void>;
  onApplyToAll: (sourceBranchId: number) => Promise<void>;
}
// #end-interface

// #component BranchSocialsModal
const BranchSocialsModal = ({
  branch,
  totalBranches,
  onClose,
  onLoadSocials,
  onCreateSocial,
  onUpdateSocial,
  onDeleteSocial,
  onApplyToAll
}: BranchSocialsModalProps) => {
  // #hook useToast - notificaciones
  const toast = useToast();
  // #end-hook

  const [socials, setSocials] = useState<BranchSocial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<BranchSocialFormData>({
    platform: 'facebook',
    url: ''
  });

  // Cargar redes sociales
  const loadSocials = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await onLoadSocials(branch.id);
      setSocials(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar redes sociales');
    } finally {
      setIsLoading(false);
    }
  }, [branch.id, onLoadSocials]);

  // Cargar al montar
  useEffect(() => {
    loadSocials();
  }, [loadSocials]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.url.trim()) {
      setError('La URL es obligatoria');
      return;
    }

    try {
      if (editingId) {
        // Actualizar
        await onUpdateSocial(branch.id, editingId, formData);
      } else {
        // Crear
        await onCreateSocial(branch.id, formData);
      }
      
      // Recargar lista
      await loadSocials();
      
      // Limpiar formulario
      setFormData({ platform: 'facebook', url: '' });
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    }
  };

  const handleEdit = (social: BranchSocial) => {
    setEditingId(social.id);
    setFormData({
      platform: social.platform,
      url: social.url
    });
  };

  const handleDelete = async (socialId: number) => {
    if (!confirm('¿Eliminar esta red social?')) return;

    setError(null);
    try {
      await onDeleteSocial(branch.id, socialId);
      await loadSocials();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    }
  };

  const handleCancel = () => {
    setFormData({ platform: 'facebook', url: '' });
    setEditingId(null);
    setError(null);
  };

  const handleApplyToAll = async () => {
    if (socials.length === 0) {
      setError('No hay redes sociales para aplicar');
      return;
    }

    if (!confirm(
      `¿Aplicar estas ${socials.length} redes sociales a las otras ${totalBranches - 1} sucursales?\n\n` +
      'Esto reemplazará las redes sociales existentes en todas las demás sucursales.'
    )) return;

    setError(null);
    try {
      await onApplyToAll(branch.id);
      toast.success('¡Redes sociales aplicadas exitosamente a todas las sucursales!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al aplicar');
    }
  };

  const getUsedPlatforms = () => socials.map(s => s.platform);
  const getAvailablePlatforms = () => {
    const used = getUsedPlatforms();
    return SOCIAL_PLATFORMS.filter(p => 
      !used.includes(p.value) || (editingId && formData.platform === p.value)
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content ${styles.modalWide}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Redes Sociales - {branch.name || 'Sucursal'}</h2>
          <div className={styles.headerActions}>
            {totalBranches > 1 && socials.length > 0 && (
              <button
                onClick={handleApplyToAll}
                className="btn-pri btn-sm"
                disabled={isLoading}
                title="Aplicar estas redes sociales a todas las sucursales"
              >
                📢 Aplicar a Todas ({totalBranches - 1})
              </button>
            )}
            <button className="modal-close" onClick={onClose}>×</button>
          </div>
        </div>

        <div className="modal-body">
          {error && (
            <div className={styles.error}>
              <span>⚠️ {error}</span>
              <button onClick={() => setError(null)}>×</button>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Plataforma</label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  className={styles.select}
                  disabled={isLoading}
                >
                  {getAvailablePlatforms().map(platform => (
                    <option key={platform.value} value={platform.value}>
                      {platform.icon} {platform.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>URL</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder={SOCIAL_PLATFORMS.find(p => p.value === formData.platform)?.placeholder}
                  className={styles.input}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className={styles.formActions}>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-sec btn-sm"
                  disabled={isLoading}
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                className="btn-pri btn-sm"
                disabled={isLoading || getAvailablePlatforms().length === 0}
              >
                {editingId ? 'Actualizar' : 'Agregar'}
              </button>
            </div>
          </form>

          {/* Lista de redes sociales */}
          <div className={styles.socialsList}>
            {isLoading && socials.length === 0 ? (
              <p className={styles.loading}>Cargando...</p>
            ) : socials.length === 0 ? (
              <p className={styles.empty}>No hay redes sociales configuradas</p>
            ) : (
              socials.map(social => {
                const platformInfo = SOCIAL_PLATFORMS.find(p => p.value === social.platform);
                return (
                  <div key={social.id} className={styles.socialItem}>
                    <div className={styles.socialInfo}>
                      <span className={styles.socialIcon}>{platformInfo?.icon}</span>
                      <div className={styles.socialDetails}>
                        <strong>{platformInfo?.label}</strong>
                        <a href={social.url} target="_blank" rel="noopener noreferrer" className={styles.socialUrl}>
                          {social.url}
                        </a>
                      </div>
                    </div>
                    <div className={styles.socialActions}>
                      <button
                        onClick={() => handleEdit(social)}
                        className="btn-sec btn-sm"
                        disabled={isLoading}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(social.id)}
                        className="btn-danger btn-sm"
                        disabled={isLoading}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchSocialsModal;
// #end-component