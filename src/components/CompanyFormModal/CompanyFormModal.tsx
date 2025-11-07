/* src/components/CompanyFormModal/CompanyFormModal.tsx */
// #section imports
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import type { Company, CompanyFormData } from '../../store/Companies.types';
import styles from './CompanyFormModal.module.css';
import '/src/styles/modal.css';
import '/src/styles/button.css';
// #end-section

// #interface CompanyFormModalProps
interface CompanyFormModalProps {
  /** Si se está editando una compañía existente */
  company?: Company;
  /** Callback para cerrar el modal */
  onClose: () => void;
  /** Callback para crear o actualizar */
  onSubmit: (data: CompanyFormData) => Promise<void>;
  /** Función para verificar disponibilidad del nombre */
  onCheckNameAvailability?: (name: string) => Promise<boolean>;
}
// #end-interface

// #component CompanyFormModal
const CompanyFormModal = ({
  company,
  onClose,
  onSubmit,
  onCheckNameAvailability
}: CompanyFormModalProps) => {
  const isEditing = !!company;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    watch
  } = useForm<CompanyFormData>({
    defaultValues: {
      name: company?.name || '',
      description: company?.description || '',
      logoUrl: company?.logoUrl || ''
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [nameAvailable, setNameAvailable] = useState<boolean | null>(null);

  const watchedName = watch('name');

  // Validaciones del formulario
  register('name', {
    required: 'El nombre es obligatorio',
    minLength: { value: 1, message: 'El nombre debe tener al menos 1 carácter' },
    maxLength: { value: 255, message: 'El nombre no puede superar 255 caracteres' }
  });

  register('description', {
    maxLength: { value: 500, message: 'La descripción no puede superar 500 caracteres' }
  });

  register('logoUrl');

  // Verificar disponibilidad del nombre al escribir (solo al crear)
  useEffect(() => {
    if (isEditing || !onCheckNameAvailability || !watchedName) {
      setNameAvailable(null);
      return;
    }

    // Si el nombre es igual al original (al editar), no verificar
    if (company && watchedName === (company as Company).name) {
      setNameAvailable(null);
      return;
    }

    const timer = setTimeout(async () => {
      if (watchedName.trim().length > 0) {
        setIsCheckingName(true);
        try {
          const available = await onCheckNameAvailability(watchedName.trim());
          setNameAvailable(available);
          if (!available) {
            setError('name', {
              type: 'manual',
              message: 'Este nombre ya está en uso'
            });
          } else {
            clearErrors('name');
          }
        } catch (error) {
          console.error('Error checking name:', error);
        } finally {
          setIsCheckingName(false);
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [watchedName, isEditing, company, onCheckNameAvailability, setError, clearErrors]);

  const handleFormSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('name', {
        type: 'manual',
        message: error instanceof Error ? error.message : 'Error al guardar'
      });
    } finally {
      setIsLoading(false);
    }
  });

  const renderErrors = (error: { message?: string } | undefined) => {
    if (!error) return null;
    return (
      <span className={styles.errorMessage}>
        {error.message}
      </span>
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Botón cerrar */}
        <button
          className="btn-close"
          style={{ position: 'absolute', top: 0, right: 0 }}
          onClick={onClose}
          aria-label="Cerrar ventana"
          disabled={isLoading}
        >
          ×
        </button>

        {/* Body */}
        <div className="modal-body" style={{ marginTop: '20px' }}>
          <h3 className="modal-title">
            {isEditing ? 'Editar Compañía' : 'Crear Nueva Compañía'}
          </h3>

          <form onSubmit={handleFormSubmit} style={{ width: '100%' }}>
            <div className={styles.formContainer}>
              {/* Nombre */}
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>
                  Nombre de la compañía *
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Ej: Mi Empresa"
                  aria-invalid={errors.name ? 'true' : 'false'}
                  disabled={isLoading}
                  {...register('name')}
                  className={styles.input}
                />
                {isCheckingName && (
                  <span className={styles.checkingText}>Verificando disponibilidad...</span>
                )}
                {!isEditing && nameAvailable === true && (
                  <span className={styles.successText}>✓ Nombre disponible</span>
                )}
                {renderErrors(errors.name)}
              </div>

              {/* Descripción */}
              <div className={styles.formGroup}>
                <label htmlFor="description" className={styles.label}>
                  Descripción (opcional)
                </label>
                <textarea
                  id="description"
                  placeholder="Describe tu compañía..."
                  rows={4}
                  maxLength={500}
                  aria-invalid={errors.description ? 'true' : 'false'}
                  disabled={isLoading}
                  {...register('description')}
                  className={styles.textarea}
                />
                {renderErrors(errors.description)}
              </div>

              {/* Logo URL */}
              <div className={styles.formGroup}>
                <label htmlFor="logoUrl" className={styles.label}>
                  URL del Logo (opcional)
                </label>
                <input
                  type="text"
                  id="logoUrl"
                  placeholder="https://ejemplo.com/logo.png"
                  aria-invalid={errors.logoUrl ? 'true' : 'false'}
                  disabled={isLoading}
                  {...register('logoUrl')}
                  className={styles.input}
                />
                {renderErrors(errors.logoUrl)}
                <span className={styles.helperText}>
                  Más adelante podrás subir imágenes directamente
                </span>
              </div>

              {/* Botones */}
              <div className={styles.formActions}>
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
                  disabled={isLoading || isCheckingName || (nameAvailable === false && !isEditing)}
                >
                  {isLoading ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Crear Compañía'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyFormModal;
// #end-component