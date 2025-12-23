// src/components/SettingsModal/SettingsModal.tsx

// #section imports
import { useState, useRef } from 'react';
import type { ChangeEvent } from 'react';
import { useUserDataStore } from '../../store/UserData.store';
import { uploadUserAvatar, deleteUserAvatar } from '../../services/users/userAvatar.service';
import { useToast } from '../../hooks/useToast';
import styles from './SettingsModal.module.css';
// #end-section

// #interface SettingsModalProps
interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}
// #end-interface

// #component SettingsModal
const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  // #state user data from store
  const { imageUrl, setImageUrl } = useUserDataStore();
  // #end-state

  // #hook useToast
  const toast = useToast();
  // #end-hook

  // #state local states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // #end-state

  // #ref fileInputRef
  const fileInputRef = useRef<HTMLInputElement>(null);
  // #end-ref

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  // #function handleFileChange
  /**
   * Maneja la selección de archivo.
   */
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Formato no válido. Solo JPG, PNG, GIF, WEBP');
      return;
    }

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('El archivo es muy grande. Máximo 5MB');
      return;
    }

    setError(null);
    setSelectedFile(file);

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  // #end-function

  // #function handleUpload
  /**
   * Sube la imagen seleccionada.
   */
  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    try {
      const response = await uploadUserAvatar(selectedFile);
      setImageUrl(response.user.imageUrl || null);
      setSelectedFile(null);
      setPreviewUrl(null);
      toast.success('Avatar actualizado exitosamente');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al subir imagen';
      setError(errorMessage);
      console.error('Error uploading avatar:', err);
    } finally {
      setIsUploading(false);
    }
  };
  // #end-function

  // #function handleDelete
  /**
   * Elimina el avatar actual.
   */
  const handleDelete = async () => {
    if (!imageUrl) return;

    if (!confirm('¿Estás seguro de eliminar tu foto de perfil?')) return;

    setIsUploading(true);
    setError(null);

    try {
      const response = await deleteUserAvatar();
      setImageUrl(response.user.imageUrl || null);
      toast.success('Avatar eliminado exitosamente');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar imagen';
      setError(errorMessage);
      console.error('Error deleting avatar:', err);
    } finally {
      setIsUploading(false);
    }
  };
  // #end-function

  // #function handleClearSelection
  /**
   * Limpia la selección de archivo.
   */
  const handleClearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  // #end-function

  // #function handleBackdropClick
  /**
   * Cierra el modal al hacer click en el backdrop.
   */
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  // #end-function

  // #section render
  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Configuración</h2>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            disabled={isUploading}
          >
            ✕
          </button>
        </div>

        <div className={styles.content}>
          <h3>Foto de perfil</h3>

          {/* Preview de imagen actual o nueva */}
          <div className={styles.imagePreview}>
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" />
            ) : imageUrl ? (
              <img src={imageUrl} alt="Avatar actual" />
            ) : (
              <div className={styles.placeholder}>Sin imagen</div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className={styles.error}>{error}</div>
          )}

          {/* Input de archivo */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            disabled={isUploading}
            className={styles.fileInput}
          />
          <p className={styles.helperText}>
            Formatos: JPG, PNG, GIF, WEBP. Máximo 5MB
          </p>

          {/* Botones */}
          <div className={styles.actions}>
            {selectedFile && (
              <>
                <button
                  className="btn-sec btn-md"
                  onClick={handleClearSelection}
                  disabled={isUploading}
                >
                  Cancelar
                </button>
                <button
                  className="btn-pri btn-md"
                  onClick={handleUpload}
                  disabled={isUploading}
                >
                  {isUploading ? 'Subiendo...' : 'Subir imagen'}
                </button>
              </>
            )}

            {!selectedFile && imageUrl && (
              <button
                className="btn-danger btn-md"
                onClick={handleDelete}
                disabled={isUploading}
              >
                {isUploading ? 'Eliminando...' : 'Eliminar imagen'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  // #end-section
};

export default SettingsModal;
// #end-component