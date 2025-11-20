/* src/components/ProductFormModal/ProductFormModal.tsx */
// #section imports
import { useState, useEffect } from 'react';
import type { ProductFormData } from '../../store/Products.types';
import styles from './ProductFormModal.module.css';
import ProductImageManager from '../ProductImageManager/ProductImageManager';
// #end-section

// #interface ProductFormModalProps
interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<ProductFormData, 'categoryId'>, images: string[]) => Promise<void>;
  initialData?: Partial<Omit<ProductFormData, 'categoryId'>> & { 
    images?: string[] | string; // Aceptar tanto array como string
  };
  title?: string;
  submitText?: string;
}
// #end-interface

// #component ProductFormModal
/**
 * Modal para crear/editar productos.
 * Incluye campos para nombre, descripción, precio, descuento y stock.
 */
export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title = 'Nuevo Producto',
  submitText = 'Crear Producto'
}: ProductFormModalProps) {
  // #state form data
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [hasStockControl, setHasStockControl] = useState(false);
  const [currentStock, setCurrentStock] = useState('');
  const [stockAlertThreshold, setStockAlertThreshold] = useState('');
  const [stockStopThreshold, setStockStopThreshold] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  // #end-state

  // #state ui
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // #end-state

  // #effect - Cargar datos iniciales
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setDescription(initialData.description || '');
      setBasePrice(initialData.basePrice?.toString() || '');
      setDiscount(initialData.discount?.toString() || '');
      setHasStockControl(initialData.hasStockControl || false);
      setCurrentStock(initialData.currentStock?.toString() || '');
      setStockAlertThreshold(initialData.stockAlertThreshold?.toString() || '');
      setStockStopThreshold(initialData.stockStopThreshold?.toString() || '');
      setIsAvailable(initialData.isAvailable ?? true);
      
      // Cargar imágenes si existen
      if (initialData.images) {
        try {
          let parsedImages: string[] = [];
          
          if (typeof initialData.images === 'string') {
            // Si viene como string JSON, parsearlo
            parsedImages = JSON.parse(initialData.images);
          } else if (Array.isArray(initialData.images)) {
            // Si ya es array, usarlo directamente
            parsedImages = initialData.images;
          }
          
          setImages(parsedImages);
        } catch (error) {
          console.error('Error parsing images:', error);
          setImages([]);
        }
      } else {
        setImages([]);
      }
    }
  }, [initialData]);
  // #end-effect

  // #function resetForm
  const resetForm = () => {
    setName('');
    setDescription('');
    setBasePrice('');
    setDiscount('');
    setHasStockControl(false);
    setCurrentStock('');
    setStockAlertThreshold('');
    setStockStopThreshold('');
    setIsAvailable(true);
    setImages([]);
    setError(null);
  };
  // #end-function

  // #function handleClose
  const handleClose = () => {
    resetForm();
    onClose();
  };
  // #end-function

  // #function handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validaciones
    if (!name.trim()) {
      setError('El nombre es requerido');
      return;
    }

    if (!basePrice || parseFloat(basePrice) < 0) {
      setError('El precio base debe ser un número positivo');
      return;
    }

    if (discount && (parseFloat(discount) < 0 || parseFloat(discount) > 100)) {
      setError('El descuento debe estar entre 0 y 100');
      return;
    }

    if (hasStockControl) {
      if (!currentStock || parseInt(currentStock) < 0) {
        setError('El stock actual es requerido cuando hay control de stock');
        return;
      }
    }

    // Preparar datos
    const formData: Omit<ProductFormData, 'categoryId'> = {
      name: name.trim(),
      description: description.trim() || undefined,
      basePrice: parseFloat(basePrice),
      discount: discount ? parseFloat(discount) : undefined,
      hasStockControl,
      currentStock: hasStockControl && currentStock ? parseInt(currentStock) : undefined,
      stockAlertThreshold: stockAlertThreshold ? parseInt(stockAlertThreshold) : undefined,
      stockStopThreshold: stockStopThreshold ? parseInt(stockStopThreshold) : undefined,
      isAvailable
    };

    setIsSubmitting(true);
    try {
      await onSubmit(formData, images); // <-- PASAR IMÁGENES
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar producto');
    } finally {
      setIsSubmitting(false);
    }
  };
  // #end-function

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button
            className={styles.closeButton}
            onClick={handleClose}
            type="button"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Error */}
          {error && (
            <div className={styles.error}>
              ❌ {error}
            </div>
          )}

          {/* Nombre */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Nombre del producto <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              placeholder="Ej: Pizza Margherita"
              maxLength={100}
              required
            />
          </div>

          {/* Descripción */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.textarea}
              placeholder="Describe el producto (opcional)"
              rows={3}
              maxLength={1000}
            />
          </div>

          <ProductImageManager
            images={images}
            onImagesChange={setImages}
            maxImages={6}
          />

          {/* Precio y Descuento */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Precio Base ($) <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className={styles.input}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Descuento (%)</label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className={styles.input}
                placeholder="0"
                step="1"
                min="0"
                max="100"
              />
            </div>
          </div>

          {/* Control de Stock */}
          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={hasStockControl}
                onChange={(e) => setHasStockControl(e.target.checked)}
                className={styles.checkbox}
              />
              <span>Controlar stock de este producto</span>
            </label>
          </div>

          {/* Campos de Stock (si está activado) */}
          {hasStockControl && (
            <>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Stock Actual <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="number"
                    value={currentStock}
                    onChange={(e) => setCurrentStock(e.target.value)}
                    className={styles.input}
                    placeholder="0"
                    min="0"
                    required={hasStockControl}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Umbral de Alerta
                    <span className={styles.helpText}> (notificar)</span>
                  </label>
                  <input
                    type="number"
                    value={stockAlertThreshold}
                    onChange={(e) => setStockAlertThreshold(e.target.value)}
                    className={styles.input}
                    placeholder="5"
                    min="0"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Umbral de Parada
                  <span className={styles.helpText}> (deshabilitar automáticamente)</span>
                </label>
                <input
                  type="number"
                  value={stockStopThreshold}
                  onChange={(e) => setStockStopThreshold(e.target.value)}
                  className={styles.input}
                  placeholder="0"
                  min="0"
                />
                <p className={styles.helpText}>
                  El producto se deshabilitará automáticamente cuando el stock llegue a este valor
                </p>
              </div>
            </>
          )}

          {/* Disponibilidad */}
          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className={styles.checkbox}
              />
              <span>Producto disponible para la venta</span>
            </label>
          </div>

          {/* Buttons */}
          <div className={styles.formActions}>
            <button
              type="button"
              onClick={handleClose}
              className="btn-sec btn-md"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-pri btn-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
// #end-component