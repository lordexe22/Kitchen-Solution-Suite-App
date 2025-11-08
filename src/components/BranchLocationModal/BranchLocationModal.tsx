/* src/components/BranchLocationModal/BranchLocationModal.tsx */
// #section imports
import { useState } from 'react';
import type { BranchWithLocation, BranchLocationFormData } from '../../store/Branches.types';
import styles from './BranchLocationModal.module.css';
import '/src/styles/modal.css';
import '/src/styles/button.css';
// #end-section

// #interface BranchLocationModalProps
interface BranchLocationModalProps {
  branch: BranchWithLocation;
  onClose: () => void;
  onSave: (data: BranchLocationFormData) => Promise<void>;
}
// #end-interface

// #component BranchLocationModal
const BranchLocationModal = ({ branch, onClose, onSave }: BranchLocationModalProps) => {
  const [formData, setFormData] = useState<BranchLocationFormData>({
    address: branch.location?.address || '',
    city: branch.location?.city || '',
    state: branch.location?.state || '',
    country: branch.location?.country || '',
    postalCode: branch.location?.postalCode || '',
    latitude: branch.location?.latitude || '',
    longitude: branch.location?.longitude || ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validaciones básicas
    if (!formData.address.trim()) {
      setError('La dirección es obligatoria');
      return;
    }
    if (!formData.city.trim()) {
      setError('La ciudad es obligatoria');
      return;
    }
    if (!formData.state.trim()) {
      setError('El estado/provincia es obligatorio');
      return;
    }
    if (!formData.country.trim()) {
      setError('El país es obligatorio');
      return;
    }

    setIsLoading(true);
    try {
      await onSave(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar ubicación');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {branch.location ? 'Editar Ubicación' : 'Agregar Ubicación'}
          </h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className={styles.error}>
                <p>{error}</p>
              </div>
            )}

            {/* Dirección */}
            <div className={styles.field}>
              <label className={styles.label}>
                Dirección <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Ej: Av. Siempre Viva 123"
                className={styles.input}
                required
              />
            </div>

            {/* Ciudad */}
            <div className={styles.field}>
              <label className={styles.label}>
                Ciudad <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Ej: Santa Fe"
                className={styles.input}
                required
              />
            </div>

            {/* Estado/Provincia */}
            <div className={styles.field}>
              <label className={styles.label}>
                Estado/Provincia <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Ej: Santa Fe"
                className={styles.input}
                required
              />
            </div>

            {/* País */}
            <div className={styles.field}>
              <label className={styles.label}>
                País <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Ej: Argentina"
                className={styles.input}
                required
              />
            </div>

            {/* Código Postal (Opcional) */}
            <div className={styles.field}>
              <label className={styles.label}>Código Postal</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Ej: 3000"
                className={styles.input}
              />
            </div>

            {/* Coordenadas GPS (Opcionales) */}
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>Latitud</label>
                <input
                  type="text"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="Ej: -31.6333"
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Longitud</label>
                <input
                  type="text"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="Ej: -60.7000"
                  className={styles.input}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-sec btn-md"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-pri btn-md"
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BranchLocationModal;
// #end-component