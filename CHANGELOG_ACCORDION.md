# Changelog - Accordion Module

## Nuevas Funcionalidades Implementadas

### 1. Avatar/Logo con Fallback ✅
- **Nueva interfaz**: `AvatarProps` en `Accordion.types.ts`
  - `src`: URL de la imagen
  - `alt`: Texto alternativo
  - `fallbackText`: Texto de fallback (opcional, usa las primeras 2 letras del `alt` si no se provee)
- **Prop opcional**: `avatar` en `AccordionHeaderConfig`
- **Lógica de fallback**: Si la imagen falla al cargar, muestra un div circular con iniciales
- **Estilos CSS**: 
  - `.avatar`: Contenedor circular 40x40px
  - `.avatarFallback`: Fondo con gradiente, texto blanco, 0.85rem

**Uso:**
```tsx
<Accordion
  header={{
    title: "Mi Empresa",
    avatar: {
      src: "https://example.com/logo.png",
      alt: "Mi Empresa",
      fallbackText: "ME"
    }
  }}
>
  Contenido...
</Accordion>
```

### 2. Prop `expandable` ✅
- **Nueva prop**: `expandable?: boolean` en `AccordionProps` (default: `true`)
- **Comportamiento**: 
  - Si `expandable=false`, el acordeón se transforma en un bloque simple sin colapsar
  - No muestra indicador de expansión
  - Cursor normal en lugar de pointer
  - No tiene interacciones de toggle (sin `onClick`, `onKeyDown`, `role="button"`)
  - El contenido siempre está visible (no hay contenedor colapsable)
- **Lógica condicional**: 
  - `isExpandable = expandable && hasChildren`
  - Solo renderiza el `content` wrapper si `isExpandable === true`

**Uso:**
```tsx
<Accordion
  expandable={false}
  header={{
    title: "Panel de Información Estática",
    subtitle: "Siempre visible"
  }}
>
  Este contenido no puede colapsarse.
</Accordion>
```

## Demo Actualizado
- **Nueva sección**: "Avatar/Logo Feature" con 2 ejemplos
  - Ejemplo con logo válido
  - Ejemplo con URL inválida para mostrar fallback
- **Nueva sección**: "Non-Expandable Mode" con 2 ejemplos
  - Bloque simple con acciones
  - Panel con avatar y sin expansión

## Exports Actualizados
- `index.ts` ahora exporta `AvatarProps`

## Archivos Modificados
1. `Accordion.types.ts`: +AvatarProps, +expandable prop
2. `Accordion.tsx`: +renderAvatar function, +isExpandable logic, +avatarError state
3. `Accordion.module.css`: +.avatar, +.avatarFallback styles, modificado .leading (flex)
4. `AccordionDemo.tsx`: +2 nuevas secciones de demo
5. `index.ts`: +AvatarProps export

## Estado de Compilación
✅ 0 errores en todos los archivos del módulo
✅ 0 errores en AccordionDemo.tsx
