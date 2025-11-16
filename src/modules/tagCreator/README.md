# 🏷️ TagCreator Module

Módulo 100% autónomo y reutilizable para crear y configurar etiquetas/tags personalizadas con preview en tiempo real.

---

## ✨ Características

✅ **Modal completo** - Componente autocontenido listo para usar  
✅ **Preview en tiempo real** - Ve cómo queda mientras lo configuras  
✅ **Totalmente personalizable** - Nombre, colores, ícono, borde, tamaño  
✅ **Validación integrada** - No permite crear etiquetas inválidas  
✅ **Colores e íconos predefinidos** - Sugerencias para facilitar la creación  
✅ **Agnóstico al proyecto** - No depende de nada externo  
✅ **TypeScript completo** - Fuertemente tipado, sin `any`  
✅ **Exporta configuración** - Retorna un objeto JSON listo para guardar  

---

## 📦 Instalación

Este es un módulo interno. Solo copia la carpeta `tagCreator/` a tu proyecto en `src/modules/`.

**No tiene dependencias externas** (solo React).

---

## 🚀 Uso Básico

```typescript
import { TagCreatorModal } from '@/modules/tagCreator';
import type { TagConfiguration } from '@/modules/tagCreator';
import { useState } from 'react';

function MyComponent() {
  const [showModal, setShowModal] = useState(false);
  
  const handleTagCreated = (config: TagConfiguration) => {
    console.log('Tag creado:', config);
    // config = {
    //   name: "Vegetariano",
    //   textColor: "#10B981",
    //   backgroundColor: "#D1FAE5",
    //   icon: "🌱",
    //   hasBorder: true,
    //   size: "medium"
    // }
    
    // Guardar en backend, estado, etc.
    saveTag(config);
  };
  
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Crear Etiqueta
      </button>
      
      <TagCreatorModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleTagCreated}
      />
    </>
  );
}
```

---

## 📋 Props del Componente

```typescript
interface TagCreatorModalProps {
  /** Si el modal está abierto */
  isOpen: boolean;
  
  /** Callback para cerrar el modal */
  onClose: () => void;
  
  /** Callback cuando se confirma (recibe la configuración) */
  onConfirm: (config: TagConfiguration) => void;
  
  /** Configuración inicial (para editar una etiqueta existente) */
  initialConfig?: TagConfiguration;
  
  /** Título del modal (default: "Crear Etiqueta") */
  title?: string;
  
  /** Texto del botón confirmar (default: "Crear") */
  confirmText?: string;
  
  /** Texto del botón cancelar (default: "Cancelar") */
  cancelText?: string;
}
```

---

## 🎨 Objeto de Configuración

El módulo retorna un objeto `TagConfiguration`:

```typescript
interface TagConfiguration {
  name: string;              // Nombre de la etiqueta
  textColor: string;         // Color del texto (hex)
  backgroundColor: string;   // Color de fondo (hex)
  icon?: string;             // Ícono opcional (emoji o URL)
  hasBorder: boolean;        // Si tiene borde
  size: 'small' | 'medium' | 'large'; // Tamaño
}
```

**Ejemplo de configuración:**
```json
{
  "name": "Picante",
  "textColor": "#EF4444",
  "backgroundColor": "#FEE2E2",
  "icon": "🌶️",
  "hasBorder": true,
  "size": "medium"
}
```

---

## 🎯 Casos de Uso

### 1. Crear nueva etiqueta

```typescript
<TagCreatorModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onConfirm={(config) => {
    createTagInBackend(config);
    setShowModal(false);
  }}
/>
```

### 2. Editar etiqueta existente

```typescript
<TagCreatorModal
  isOpen={showEditModal}
  onClose={() => setShowEditModal(false)}
  initialConfig={existingTag}
  title="Editar Etiqueta"
  confirmText="Guardar"
  onConfirm={(config) => {
    updateTagInBackend(config);
    setShowEditModal(false);
  }}
/>
```

---

## 🛠️ Utilidades Disponibles

El módulo exporta funciones útiles:

```typescript
import {
  validateTagConfiguration,
  isValidHexColor,
  getContrastColor,
  suggestBackgroundColor,
  generateTagCSS,
  exportTagConfiguration,
  importTagConfiguration
} from '@/modules/tagCreator';

// Validar configuración
const errors = validateTagConfiguration(config);
if (errors.length > 0) {
  console.error('Errores:', errors);
}

// Verificar color hex válido
if (isValidHexColor('#3B82F6')) {
  console.log('Color válido');
}

// Obtener color de contraste para legibilidad
const textColor = getContrastColor('#3B82F6'); // '#FFFFFF'

// Sugerir color de fondo basado en color de texto
const bgColor = suggestBackgroundColor('#EF4444'); // '#FEE2E2'

// Generar estilos CSS para aplicar
const styles = generateTagCSS(config);
<div style={styles}>Mi etiqueta</div>

// Exportar/Importar configuración
const json = exportTagConfiguration(config);
const loaded = importTagConfiguration(json);
```

---

## 🎨 Personalización

### Colores predefinidos

Puedes modificar los colores sugeridos en `tagCreator.config.ts`:

```typescript
export const PRESET_COLORS = {
  text: ['#1F2937', '#3B82F6', '#10B981', ...],
  background: ['#F3F4F6', '#DBEAFE', '#D1FAE5', ...]
};
```

### Íconos predefinidos

```typescript
export const PRESET_ICONS = {
  food: ['🍕', '🍔', '🌮', ...],
  dietary: ['🌱', '🥬', '🌶️', ...],
  ...
};
```

### Tamaños

Los tamaños se definen en `TAG_SIZES`:

```typescript
export const TAG_SIZES = {
  small: { padding: '0.25rem 0.5rem', fontSize: '0.75rem', ... },
  medium: { padding: '0.375rem 0.75rem', fontSize: '0.875rem', ... },
  large: { padding: '0.5rem 1rem', fontSize: '1rem', ... }
};
```

---

## 🧪 Ejemplo Completo

```typescript
import { useState } from 'react';
import { TagCreatorModal, generateTagCSS, TAG_SIZES } from '@/modules/tagCreator';
import type { TagConfiguration } from '@/modules/tagCreator';

function TagManagement() {
  const [showModal, setShowModal] = useState(false);
  const [tags, setTags] = useState<TagConfiguration[]>([]);
  
  const handleCreateTag = (config: TagConfiguration) => {
    setTags(prev => [...prev, config]);
    setShowModal(false);
  };
  
  return (
    <div>
      <button onClick={() => setShowModal(true)}>
        + Nueva Etiqueta
      </button>
      
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {tags.map((tag, index) => {
          const styles = {
            ...generateTagCSS(tag),
            ...TAG_SIZES[tag.size]
          };
          
          return (
            <div key={index} style={styles}>
              {tag.icon && <span>{tag.icon}</span>}
              <span>{tag.name}</span>
            </div>
          );
        })}
      </div>
      
      <TagCreatorModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleCreateTag}
      />
    </div>
  );
}
```

---

## 📄 Licencia

Este módulo es parte del proyecto interno y sigue la misma licencia.

---

## 🤝 Contribuciones

Para agregar funcionalidades:
1. Modificar los archivos necesarios
2. Actualizar este README
3. Agregar ejemplos si corresponde