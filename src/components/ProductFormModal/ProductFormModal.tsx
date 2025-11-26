/* src/components/ProductFormModal/ProductFormModal.tsx */
import { useState, useEffect } from 'react';
import type { ProductFormData } from '../../store/Products.types';
import type { TagConfiguration } from '../../modules/tagCreator';
import styles from './ProductFormModal.module.css';
import ProductImageManager from '../ProductImageManager/ProductImageManager';
import { TagSelector } from '../TagSelector/TagSelector';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<ProductFormData, 'categoryId'>, images: string[]) => Promise<void>;
  initialData?: Partial<Omit<ProductFormData, 'categoryId'>> & { 
    images?: string[] | string;
    tags?: TagConfiguration[] | string;
  };
  title?: string;
  submitText?: string;
}

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title = 'Nuevo Producto',
  submitText = 'Crear Producto'
}: ProductFormModalProps) {
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
  const [tags, setTags] = useState<TagConfiguration[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      
      if (initialData.images) {
        try {
          let parsedImages: string[] = [];
          if (typeof initialData.images === 'string') {
            parsedImages = JSON.parse(initialData.images);
          } else if (Array.isArray(initialData.images)) {
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
      
      if (initialData.tags) {
        try {
          let parsedTags: TagConfiguration[] = [];
          if (typeof initialData.tags === 'string') {
            parsedTags = JSON.parse(initialData.tags);
          } else if (Array.isArray(initialData.tags)) {
            parsedTags = initialData.tags;
          }
          setTags(parsedTags);
        } catch (error) {
          console.error('Error parsing tags:', error);
          setTags([]);
        }
      } else {
        setTags([]);
      }
    }
  }, [initialData]);

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
    setTags([]);
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

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

    const formData: Omit<ProductFormData, 'categoryId'> = {
      name: name.trim(),
      description: description.trim() || undefined,
      basePrice: parseFloat(basePrice),
      discount: discount ? parseFloat(discount) : undefined,
      hasStockControl,
      currentStock: hasStockControl && currentStock ? parseInt(currentStock) : undefined,
      stockAlertThreshold: stockAlertThreshold ? parseInt(stockAlertThreshold) : undefined,
      stockStopThreshold: stockStopThreshold ? parseInt(stockStopThreshold) : undefined,
      isAvailable,
      tags: tags.length > 0 ? tags : undefined
    };

    setIsSubmitting(true);
    try {
      await onSubmit(formData, images);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar producto');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button className={styles.closeButton} onClick={handleClose} type="button">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>❌ {error}</div>}

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

          <div className={styles.formGroup}>
            <label className={styles.label}>Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.textarea}
              placeholder="Descripción opcional del producto"
              maxLength={1000}
            />
          </div>

          <ProductImageManager images={images} onImagesChange={setImages} />

          <TagSelector selectedTags={tags} onChange={setTags} label="Etiquetas del producto" />

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Precio Base <span className={styles.required}>*</span>
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
                step="0.01"
                min="0"
                max="100"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={hasStockControl}
                onChange={(e) => setHasStockControl(e.target.checked)}
                className={styles.checkbox}
              />
              Habilitar control de stock
            </label>
          </div>

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
                  <label className={styles.label}>Umbral de Alerta</label>
                  <input
                    type="number"
                    value={stockAlertThreshold}
                    onChange={(e) => setStockAlertThreshold(e.target.value)}
                    className={styles.input}
                    placeholder="10"
                    min="0"
                  />
                  <span className={styles.helpText}>Stock mínimo antes de alertar</span>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Umbral de Parada</label>
                <input
                  type="number"
                  value={stockStopThreshold}
                  onChange={(e) => setStockStopThreshold(e.target.value)}
                  className={styles.input}
                  placeholder="0"
                  min="0"
                />
                <span className={styles.helpText}>Stock mínimo para dejar de vender</span>
              </div>
            </>
          )}

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className={styles.checkbox}
              />
              Producto disponible para la venta
            </label>
          </div>

          <div className={styles.formActions}>
            <button type="button" onClick={handleClose} className="btn-sec btn-md" disabled={isSubmitting}>
              Cancelar
            </button>
            <button type="submit" className="btn-pri btn-md" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}