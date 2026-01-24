/* src/components/CompanyFormModal/CompanyFormModal.tsx */
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import type { Company, CompanyFormData } from '../../types/companies.types';
import { useCompaniesStore } from '../../store/Companies.store';
import styles from './CompanyFormModal.module.css';
import '/src/styles/modal.css';
import '/src/styles/button.css';

interface CompanyFormModalProps {
  /** Si se está editando una compañía existente */
  company?: Company;
  /** Callback para cerrar el modal */
  onClose: () => void;
  /** Callback para crear o actualizar - retorna la compañía guardada */
  onSubmit: (data: CompanyFormData) => Promise<Company>;
  /** Callback para subir logo */
  onUploadLogo?: (companyId: number, file: File) => Promise<Company>;
  /** Función para verificar disponibilidad del nombre */
  onCheckNameAvailability?: (name: string) => Promise<boolean>;
}

const CompanyFormModal = ({
  company,
  onClose,
  onSubmit,
  onUploadLogo,
  onCheckNameAvailability
}: CompanyFormModalProps) => {
  const isEditing = !!company;
  const updateCompanyInStore = useCompaniesStore((state) => state.updateCompany);
  
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
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [nameAvailable, setNameAvailable] = useState<boolean | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(company?.logoUrl || null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoRemoved, setLogoRemoved] = useState(false);

  const watchedName = watch('name');

  // Verificar disponibilidad del nombre al escribir (solo al crear)
  useEffect(() => {
    if (isEditing || !onCheckNameAvailability || !watchedName) {
      setNameAvailable(null);
      return;
    }

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

  // Manejar selección de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Por favor selecciona una imagen válida (JPG, PNG, GIF, WEBP)');
      return;
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('La imagen es demasiado grande. Máximo 5MB');
      return;
    }

    setSelectedFile(file);

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Limpiar archivo seleccionado
  const handleClearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setLogoRemoved(true);
  };

  const handleFormSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      // 1. Crear o actualizar la compañía
      const savedCompany = await onSubmit(data);

      // 2. Si se seleccionó un archivo Y existe onUploadLogo, subir el logo
      if (selectedFile && onUploadLogo && savedCompany?.id) {
        setIsUploadingLogo(true);
        try {
          await onUploadLogo(savedCompany.id, selectedFile);
        } catch (error) {
          console.error('Error uploading logo:', error);
          alert('La compañía se guardó pero hubo un error al subir el logo');
        } finally {
          setIsUploadingLogo(false);
        }
      }

      // 3. Si se removió el logo, actualizar el store
      if (logoRemoved && savedCompany?.id) {
        try {
          // TODO: Cuando se conecte al backend, llamar a deleteCompanyLogo
          updateCompanyInStore(savedCompany.id, { logoUrl: null });
        } catch (error) {
          console.error('Error removing logo:', error);
        }
      }

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
          disabled={isLoading || isUploadingLogo}
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
                  disabled={isLoading || isUploadingLogo}
                  {...register('name', {
                    required: 'El nombre es obligatorio',
                    minLength: { value: 1, message: 'El nombre debe tener al menos 1 carácter' },
                    maxLength: { value: 255, message: 'El nombre no puede superar 255 caracteres' }
                  })}
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
                  disabled={isLoading || isUploadingLogo}
                  {...register('description', {
                    maxLength: { value: 500, message: 'La descripción no puede superar 500 caracteres' }
                  })}
                  className={styles.textarea}
                />
                {renderErrors(errors.description)}
              </div>

              {/* Logo Upload */}
              <div className={styles.formGroup}>
                <label htmlFor="logoFile" className={styles.label}>
                  Logo de la compañía (opcional)
                </label>

                {/* Preview */}
                {previewUrl && (
                  <div className={styles.logoPreview}>
                    <img src={previewUrl} alt="Preview logo" />
                    <button
                      type="button"
                      onClick={handleClearFile}
                      className={styles.removeButton}
                      disabled={isLoading || isUploadingLogo}
                    >
                      ✕ Quitar
                    </button>
                  </div>
                )}

                {/* Input de archivo */}
                <input
                  type="file"
                  id="logoFile"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleFileChange}
                  disabled={isLoading || isUploadingLogo}
                  className={styles.fileInput}
                />
                <span className={styles.helperText}>
                  Formatos: JPG, PNG, GIF, WEBP. Máximo 5MB
                </span>
              </div>

              {/* Botones */}
              <div className={styles.formActions}>
                <button
                  type="button"
                  className="btn-sec btn-md"
                  onClick={onClose}
                  disabled={isLoading || isUploadingLogo}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-pri btn-md"
                  disabled={
                    isLoading || 
                    isUploadingLogo || 
                    isCheckingName || 
                    (nameAvailable === false && !isEditing)
                  }
                >
                  {isLoading 
                    ? 'Guardando...' 
                    : isUploadingLogo
                    ? 'Subiendo logo...'
                    : isEditing 
                    ? 'Guardar Cambios' 
                    : 'Crear Compañía'}
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
