# Accordion Module (Agnóstico)

Componente de acordeón genérico, cuya única responsabilidad es expandir/colapsar contenido. El header se define por props (datos y callbacks), no por pasar componentes.

## Uso Básico

```tsx
import { Accordion } from '@/modules/accordion';

<Accordion
  id="company-1"
  header={{
    title: 'Acme Corp',
    subtitle: 'Proveedor líder',
    leadingEmoji: '🏢',
    actions: [
      { id: 'edit', label: 'Editar', emoji: '✏️', onClick: ({ id }) => console.log(id) },
      { id: 'delete', kind: 'danger', label: 'Eliminar', emoji: '🗑️', onClick: () => {} },
    ],
    indicator: { position: 'end' },
  }}
>
  <p>Contenido interno renderizado por el consumidor.</p>
</Accordion>
```

## Props del Header
- `title`: string
- `subtitle?`: string
- `meta?`: Array<{ label?: string; value: string }>
- `badges?`: Array<{ text: string; tone?: 'neutral'|'info'|'success'|'warning'|'danger' }>
- `leadingEmoji?`: string
- `indicator?`: { position?: 'start'|'end'; hidden?: boolean }
- `actions?`: Array<{ id: string; kind?: 'primary'|'secondary'|'ghost'|'danger'|'icon'; label?: string; emoji?: string; disabled?: boolean; tooltip?: string; onClick: (args) => void }>
- `leadingControl?`: { type: 'checkbox'|'radio'|'drag-handle'|'none'; checked?: boolean; onChange?: (checked:boolean) => void; htmlProps?: { ariaLabel?: string; tabIndex?: number; onPointerDown?; onKeyDown?; draggable?: boolean; role?: string } }

## Comportamiento
- Expansión por click en el header (Enter/Espacio soportados).
- Indicador de estado configurable (inicio/fin, ocultable).
- Acciones y controles del header hacen `stopPropagation` para evitar toggles accidentales.
- `keepMounted` permite mantener el contenido montado cuando está colapsado.

## Estilos
- CSS variables: `--transition-duration`, `--border-color`, `--border-radius`, `--header-bg`, `--header-hover-bg`, `--content-bg`.
- Clases externas: `className`, `headerClassName`, `contentClassName` permiten aplicar estilos desde `src/styles`.
- Variantes: `variant` agrega `data-variant="<valor>"` al contenedor para apuntar reglas globales.

### Integración con estilos globales (opcional)

```css
/* src/styles/components/accordion.css */
[data-variant="dashboard"] {
  --header-bg: var(--dashboard-header-bg);
  --border-radius: 12px;
}

[data-variant="compact"] .contentInner { padding: 8px; }
```

```tsx
<Accordion
  variant="dashboard"
  className="my-accordion"
  headerClassName="my-accordion-header"
  contentClassName="my-accordion-content"
  header={{ title: 'Empresa', leadingEmoji: '🏢' }}
>
  {/* contenido */}
</Accordion>
```

## Filosofía
- El componente no conoce el dominio; solo renderiza estructura y maneja expansión/colapso.
- El contenido (children) y la lógica de negocio son responsabilidad del consumidor.