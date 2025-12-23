/* src/components/BranchLocationRow/BranchLocationRow.tsx */
import { useState, useEffect } from 'react';
import type { BranchWithLocation, BranchLocationFormData } from '../../store/Branches.types';
import { useModulePermissions } from '../../hooks/useModulePermissions';
import { useToast } from '../../hooks/useToast';
import styles from './BranchLocationRow.module.css';
import '/src/styles/button.css';

interface Props {
  branch: BranchWithLocation;
  companyId: number;
  location: BranchLocationFormData | null;
  onSaveLocation: (branchId: number, data: BranchLocationFormData) => Promise<void>;
  onDeleteLocation: (branchId: number) => Promise<void>;
  isLoading?: boolean;
}

const BranchLocationRow = ({ branch, location, onSaveLocation, onDeleteLocation, isLoading }: Props) => {
  // #hook useModulePermissions - verificar permisos del usuario
  const { canEdit } = useModulePermissions('schedules'); // location usa el mismo módulo que schedules
  // #end-hook
  
  // #hook useToast - mostrar notificaciones
  const toast = useToast();
  // #end-hook
  
  const [formData, setFormData] = useState<BranchLocationFormData>({
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    latitude: '',
    longitude: ''
  });

  useEffect(() => {
    if (location) {
      setFormData(location);
    } else {
      setFormData({
        address: '', city: '', state: '', country: '', postalCode: '', latitude: '', longitude: ''
      });
    }
  }, [location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    // Validaciones mínimas
    if (!formData.address.trim() || !formData.city.trim() || !formData.state.trim() || !formData.country.trim()) {
      toast.warning('Completa los campos obligatorios: Dirección, Ciudad, Estado, País');
      return;
    }

    try {
      await onSaveLocation(branch.id, formData);
      toast.success('Ubicación guardada correctamente');
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Error al guardar ubicación');
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Eliminar la ubicación de esta sucursal?')) return;
    try {
      await onDeleteLocation(branch.id);
      toast.success('Ubicación eliminada correctamente');
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Error al eliminar ubicación');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.rowTop}>
        <div className={styles.title}>{branch.name}</div>
        {canEdit && (
          <div className={styles.actions}>
            <button className="btn-sec btn-sm" onClick={() => { setFormData(location || { address: '', city: '', state: '', country: '', postalCode: '', latitude: '', longitude: '' }); }} disabled={isLoading}>Restaurar</button>
            <button className="btn-pri btn-sm" onClick={handleSave} disabled={isLoading}>Guardar</button>
            {location && (
              <button className="btn-danger btn-sm" onClick={handleDelete} disabled={isLoading}>Eliminar</button>
            )}
          </div>
        )}
      </div>

      <div className={styles.fields}>
        <div className={styles.field}>
          <label>Dirección *</label>
          <input name="address" value={formData.address} onChange={handleChange} disabled={!canEdit} readOnly={!canEdit} />
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label>Ciudad *</label>
            <input name="city" value={formData.city} onChange={handleChange} disabled={!canEdit} readOnly={!canEdit} />
          </div>
          <div className={styles.field}>
            <label>Estado/Provincia *</label>
            <input name="state" value={formData.state} onChange={handleChange} disabled={!canEdit} readOnly={!canEdit} />
          </div>
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label>País *</label>
            <input name="country" value={formData.country} onChange={handleChange} disabled={!canEdit} readOnly={!canEdit} />
          </div>
          <div className={styles.field}>
            <label>Código Postal</label>
            <input name="postalCode" value={formData.postalCode} onChange={handleChange} disabled={!canEdit} readOnly={!canEdit} />
          </div>
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label>Latitud</label>
            <input name="latitude" value={formData.latitude} onChange={handleChange} disabled={!canEdit} readOnly={!canEdit} />
          </div>
          <div className={styles.field}>
            <label>Longitud</label>
            <input name="longitude" value={formData.longitude} onChange={handleChange} disabled={!canEdit} readOnly={!canEdit} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchLocationRow;
