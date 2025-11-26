/* src/components/ProductImageManager/ProductImageManager.tsx */
// #section imports
import { useState, useRef } from 'react';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styles from './ProductImageManager.module.css';
// #end-section

// #interface ProductImageManagerProps
interface ProductImageManagerProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}
// #end-interface

// #interface SortableImageProps
interface SortableImageProps {
  id: string;
  imageUrl: string;
  index: number;
  onRemove: () => void;
}
// #end-interface

// #component SortableImage
/**
 * Imagen individual con capacidad de drag & drop.
 * 
 * IMPORTANTE: Los listeners del drag solo se aplican al área de la imagen,
 * NO al botón de eliminar, para que el botón funcione correctamente.
 */
function SortableImage({ id, imageUrl, index, onRemove }: SortableImageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.imageItem} ${isDragging ? styles.dragging : ''}`}
    >
      {/* Área arrastrable: SOLO la imagen tiene los listeners */}
      <div 
        className={styles.dragHandle}
        {...attributes}
        {...listeners}
      >
        <img src={imageUrl} alt={`Producto ${index + 1}`} className={styles.image} />
        
        {/* Badge de orden */}
        <div className={styles.orderBadge}>
          {index === 0 ? 'Principal' : index + 1}
        </div>
      </div>

      {/* Botón eliminar - FUERA del área arrastrable */}
      <button
        type="button"
        className={styles.removeButton}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log(`🗑️ Eliminando imagen ${index}`);
          onRemove();
        }}
      >
        ✕
      </button>
    </div>
  );
}
// #end-component

// #component ProductImageManager
/**
 * Gestor de imágenes del producto con drag & drop para reordenar.
 * La primera imagen es la imagen principal.
 */
export default function ProductImageManager({
  images,
  onImagesChange,
  maxImages = 6
}: ProductImageManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // #event handleFileSelect
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;

    // Validar límite
    if (images.length + files.length > maxImages) {
      alert(`Máximo ${maxImages} imágenes permitidas`);
      return;
    }

    // Validar tipos
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const invalidFiles = files.filter(f => !allowedTypes.includes(f.type));
    
    if (invalidFiles.length > 0) {
      alert('Solo se permiten imágenes JPG, PNG, GIF o WEBP');
      return;
    }

    // Validar tamaños
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter(f => f.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      alert('Las imágenes no deben superar 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Convertir a base64 para preview temporal
      const newImageUrls = await Promise.all(
        files.map(file => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        })
      );

      console.log(`📷 Agregando ${newImageUrls.length} imagen(es) nuevas`);
      onImagesChange([...images, ...newImageUrls]);
    } catch (error) {
      console.error('Error loading images:', error);
      alert('Error al cargar las imágenes');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  // #end-event

  // #event handleRemoveImage
  const handleRemoveImage = (index: number) => {
    console.log(`🗑️ Eliminando imagen en índice ${index}`);
    const newImages = images.filter((_, i) => i !== index);
    console.log(`✅ Imágenes restantes: ${newImages.length}`);
    onImagesChange(newImages);
  };
  // #end-event

  // #event handleDragEnd
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((_, i) => `image-${i}` === active.id);
    const newIndex = images.findIndex((_, i) => `image-${i}` === over.id);

    console.log(`🔄 Reordenando imagen de ${oldIndex} a ${newIndex}`);
    const reordered = arrayMove(images, oldIndex, newIndex);
    onImagesChange(reordered);
  };
  // #end-event

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <label className={styles.label}>
          Imágenes del Producto
          <span className={styles.helpText}> (La primera será la imagen principal)</span>
        </label>
        <span className={styles.counter}>
          {images.length} / {maxImages}
        </span>
      </div>

      {/* Lista de imágenes con drag & drop */}
      {images.length > 0 && (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={images.map((_, i) => `image-${i}`)}
            strategy={horizontalListSortingStrategy}
          >
            <div className={styles.imagesList}>
              {images.map((imageUrl, index) => (
                <SortableImage
                  key={`image-${index}`}
                  id={`image-${index}`}
                  imageUrl={imageUrl}
                  index={index}
                  onRemove={() => handleRemoveImage(index)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Botón agregar imágenes */}
      {images.length < maxImages && (
        <div className={styles.uploadSection}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            multiple
            onChange={handleFileSelect}
            className={styles.fileInput}
            disabled={isUploading}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={styles.uploadButton}
            disabled={isUploading}
          >
            {isUploading ? '📤 Cargando...' : '📷 Agregar Imágenes'}
          </button>
          <p className={styles.uploadHint}>
            JPG, PNG, GIF o WEBP • Máximo 5MB por imagen
          </p>
        </div>
      )}
    </div>
  );
}
// #end-component