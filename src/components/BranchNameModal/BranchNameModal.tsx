/* src/components/BranchNameModal/BranchNameModal.tsx */
// #section imports
import { useState } from 'react';
import type { BranchWithLocation } from '../../store/Branches.types';
import styles from './BranchNameModal.module.css';
import '/src/styles/modal.css';
import '/src/styles/button.css';
// #end-section
// #interface BranchNameModalProps
interface BranchNameModalProps {
  branch: BranchWithLocation;
  onClose: () => void;
  onSave: (name: string | null) => Promise<void>;
}
// #end-interface
// #component BranchNameModal
const BranchNameModal = ({ branch, onClose, onSave }: BranchNameModalProps) => {
  const [name, setName] = useState<string>(branch.name || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validar longitud
    if (name.trim().length > 255) {
      setError('El nombre no puede superar los 255 caracteres');
      return;
    }

    setIsLoading(true);
    try {
      // Si el nombre está vacío, enviar null
      const finalName = name.trim() === '' ? null : name.trim();
      await onSave(finalName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar nombre');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Editar Nombre de Sucursal</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className={styles.error}>
                <p>{error}</p>
              </div>
            )}

            <div className={styles.field}>
              <label className={styles.label}>
                Nombre de la Sucursal
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Local Centro, Sucursal Norte (opcional)"
                className={styles.input}
                maxLength={255}
              />
              <p className={styles.hint}>
                Dejar vacío para usar el nombre automático (Sucursal N)
              </p>
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

export default BranchNameModal;
// #end-component