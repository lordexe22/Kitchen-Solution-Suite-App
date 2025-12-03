/* src/modules/accordion/Accordion.tsx */
// #section Imports
import React from 'react';
import styles from './Accordion.module.css';
import type { AccordionProps, IndicatorPosition } from './Accordion.types';
import { useAccordionState, useAccordionKeyboard } from './Accordion.hooks';
import { DEFAULT_TRANSITION_DURATION, DEFAULT_INDICATOR_POSITION, INDICATOR_ICON, DEFAULT_ROTATION_DEGREES } from './Accordion.config';
// #end-section

// #component Accordion
/**
 * Componente Accordion accesible con estado interno, acciones y variantes.
 * Soporta drag handle para reordenamiento, metadatos y acciones en el header.
 * 
 * @props {AccordionProps} props - Configuración completa del acordeón
 * @accessibility role=button en header; aria-expanded/controls; region en contenido
 * @performance useCallback para handlers; evita recrear closures en cada render
 * 
 * @example
 * <Accordion
 *   id="acc-1"
 *   header={{ title: "Mi acordeón" }}
 *   rightButtons={[{ id: 'edit', label: 'Editar', onClick: () => {} }]}
 *   defaultExpanded={false}
 * >
 *   Contenido del acordeón
 * </Accordion>
 */
export const Accordion: React.FC<AccordionProps> = ({
  id,
  header,
  children,
  defaultExpanded = false,
  isExpanded: isExpandedProp,
  expandable = true,
  keepContentMounted = false,
  disabled = false,
  transitionDurationMs = DEFAULT_TRANSITION_DURATION,
  className = '',
  headerClassName = '',
  contentClassName = '',
  variant,
  customStyles,
  rightButtons,
  rightButtonsLayout,
  rightButtonsClassName,
  rightButtonsVariant,
  rightButtonsOrder,
  onRightButtonClick,
  onToggle,
}) => {
  // #const hooks
  const { isExpanded, handleToggle } = useAccordionState(defaultExpanded, isExpandedProp, onToggle, id, disabled);
  const handleKeyDown = useAccordionKeyboard(handleToggle);
  const [avatarError, setAvatarError] = React.useState(false);
  // #end-const
  // #const derived
  const indicatorPos: IndicatorPosition = header.indicator?.position || DEFAULT_INDICATOR_POSITION;
  const indicatorHidden = !!header.indicator?.hidden;
  const rotationDegrees = header.indicator?.rotationDegrees || DEFAULT_ROTATION_DEGREES;
  const indicatorIcon = header.indicator?.icon || INDICATOR_ICON;
  const hasChildren = !!children;
  const isExpandable = expandable && hasChildren;
  const shouldShowIndicator = isExpandable && !indicatorHidden;
  const isDraggable = !!header.dragHandle && !isExpanded;
  // #end-const
  // #function renderAvatar
  /**
   * Renderiza el avatar/logo circular si está configurado.
   * Incluye fallback con iniciales si la imagen no carga.
   * @returns {React.ReactElement | null} Avatar o null si no hay
   */
  const renderAvatar = (): React.ReactElement | null => {
    const av = header.avatar;
    if (!av) return null;
    const computeInitials = (text: string): string => {
      const trimmed = (text || '').trim();
      if (!trimmed) return '';
      
      // Filtrar palabras significativas (sin artículos, preposiciones, etc.)
      const words = trimmed.split(/\s+/).filter(word => {
        const lower = word.toLowerCase();
        const stopWords = ['de', 'del', 'la', 'el', 'los', 'las', 'y', 'e', 'o', 'u', 'a', 'an', 'the', 'of', 'and', 'or'];
        return word.length > 0 && !stopWords.includes(lower);
      });
      
      if (words.length === 0) return trimmed.substring(0, 2).toUpperCase();
      if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
      
      // Tomar primera letra de primera y última palabra significativa
      const first = words[0][0] || '';
      const last = words[words.length - 1][0] || '';
      return `${first}${last}`.toUpperCase();
    };
    const initials = computeInitials(av.alt || (typeof header.title === 'string' ? header.title : ''));
    return (
      <div className={styles.avatar}>
        {!avatarError ? (
          <img
            src={av.src}
            alt={av.alt}
            onError={() => setAvatarError(true)}
          />
        ) : (
          <div className={styles.avatarFallback}>
            {initials}
          </div>
        )}
      </div>
    );
  };
  // #end-function
  // #const indicator
  /**
   * Elemento visual del indicador de expansión (flecha).
   * Se renderiza solo si es expandible y no está hidden.
   */
  const indicator = shouldShowIndicator && (
    <span
      className={`${styles.indicator} ${indicatorPos === 'start' ? styles.indicatorStart : ''}`}
      aria-hidden="true"
    >
      <span 
        className={`${styles.arrow} ${isExpanded ? styles.arrowExpanded : ''}`}
        style={{ '--rotation-degrees': `${rotationDegrees}deg` } as React.CSSProperties}
      >
        {indicatorIcon}
      </span>
    </span>
  );
  // #end-const

  // #function renderRightButtons
  /**
   * Renderiza el contenedor y los botones derechos configurables.
   * Aplica grid basado en props de layout.
   */
  const renderRightButtons = (): React.ReactElement | null => {
    if (!rightButtons || rightButtons.length === 0) return null;
    const rows = rightButtonsLayout?.rows ?? 1;
    const colsExplicit = rightButtonsLayout?.cols;
    const gap = rightButtonsLayout?.gap ?? 8;
    const align = rightButtonsLayout?.align ?? 'center';
    const justify = rightButtonsLayout?.justify ?? 'end';
    const wrap = rightButtonsLayout?.wrap ?? true;
    const order = rightButtonsOrder || { horizontal: 'rtl', vertical: 'ttb', orientation: rows > 1 ? 'column' : 'row' };

    // Aplicar orden horizontal por defecto: RTL
    const items = [...rightButtons];
    if (order.horizontal === 'rtl') {
      items.reverse();
    }

    const style: React.CSSProperties = {};
    
    // Multi-fila / orientación preferida
    if (rows > 1 || order.orientation === 'column') {
      // Calcular columnas: usar explícito o auto-calcular
      const cols = colsExplicit ?? Math.ceil(items.length / rows);
      style.display = 'grid';
      style.gridTemplateRows = `repeat(${rows}, auto)`;
      style.gridTemplateColumns = `repeat(${cols}, auto)`;
      style.gap = typeof gap === 'number' ? `${gap}px` : gap;
      style.justifyContent = justify;
      style.alignItems = align;
      // gridAutoFlow correcto:
      // - 'row' = llenar por filas (izq->der, luego siguiente fila) = TTB cuando orientation='column'
      // - 'column' = llenar por columnas (arriba->abajo, luego siguiente col) = TTB cuando orientation='row'
      if (order.orientation === 'column') {
        // Prioridad vertical: llenar columnas primero (top-to-bottom)
        style.gridAutoFlow = order.vertical === 'ttb' ? 'column' : 'column';
      } else {
        // Prioridad horizontal: llenar filas primero
        style.gridAutoFlow = order.vertical === 'ttb' ? 'row' : 'row';
      }
    } else {
      // Layout flex horizontal
      style.display = 'flex';
      style.flexDirection = order.horizontal === 'rtl' ? 'row-reverse' : 'row';
      style.flexWrap = wrap ? 'wrap' : 'nowrap';
      style.gap = typeof gap === 'number' ? `${gap}px` : gap;
      style.alignItems = align;
      style.justifyContent = justify;
    }

    const handleBtnClick = (btn: { id: string; onClick: (args: { id: string; accordionId?: string }) => void; disabled?: boolean; }) => (e: React.MouseEvent) => {
      e.stopPropagation();
      if (btn.disabled) return;
      onRightButtonClick?.(btn.id, id);
      btn.onClick({ id: btn.id, accordionId: id });
    };

    return (
      <div
        className={`${styles.rightButtons} ${rightButtonsClassName || ''}`}
        style={style}
        data-variant={rightButtonsVariant}
        onClick={(e) => e.stopPropagation()}
      >
        {items.map((item, idx) => {
          // Si es un elemento React, renderizar directamente
          if (React.isValidElement(item)) {
            return (
              <div key={`rb-node-${idx}`} className={styles.rightButtonWrapper}>
                {item}
              </div>
            );
          }
          // Si es configuración declarativa, renderizar como botón
          const b = item as { id: string; className?: string; ariaLabel?: string; icon?: React.ReactNode | string; label?: string; disabled?: boolean; tooltip?: string; onClick: (args: { id: string; accordionId?: string }) => void };
          const isIconOnly = !!b.icon && !b.label;
          const btnClass = isIconOnly ? styles.actionBtnIcon : styles.actionBtn;
          const aria = b.ariaLabel || (b.label ? b.label : typeof b.icon === 'string' ? b.icon : b.id);
          return (
            <button
              key={b.id}
              className={`${btnClass} ${b.className || ''}`}
              title={b.tooltip || (b.label ? b.label : undefined)}
              disabled={b.disabled}
              onClick={handleBtnClick(b)}
              aria-label={aria}
              style={{ cursor: b.disabled ? 'not-allowed' : 'pointer' }}
            >
              {b.label ? (
                b.label
              ) : (
                b.icon && <span>{b.icon}</span>
              )}
            </button>
          );
        })}
      </div>
    );
  };
  // #end-function
  // #section render
  // Construir estilos personalizados
  const inlineStyles: React.CSSProperties = {
    '--transition-duration': `${transitionDurationMs}ms`,
    ...(customStyles?.headerBg && { '--header-bg': customStyles.headerBg }),
    ...(customStyles?.headerHoverBg && { '--header-hover-bg': customStyles.headerHoverBg }),
    ...(customStyles?.contentBg && { '--content-bg': customStyles.contentBg }),
    ...(customStyles?.borderColor && { '--border-color': customStyles.borderColor }),
    ...(customStyles?.borderRadius && { '--border-radius': customStyles.borderRadius }),
    ...(customStyles?.titleColor && { '--title-color': customStyles.titleColor }),
    ...(customStyles?.subtitleColor && { '--subtitle-color': customStyles.subtitleColor }),
  } as React.CSSProperties;

  return (
    <div
      className={`${styles.accordion} ${className}`}
      data-disabled={disabled}
      data-expanded={isExpanded}
      data-variant={variant}
      style={inlineStyles}
    >
      {/* #section header */}
      <div
        className={`${styles.header} ${disabled ? 'disabled' : ''} ${isDraggable ? styles.draggable : ''} ${headerClassName}`}
        role={isExpandable ? 'button' : undefined}
        aria-expanded={isExpandable ? isExpanded : undefined}
        aria-controls={isExpandable ? `acc-content-${id || 'auto'}` : undefined}
        aria-disabled={disabled}
        aria-label={header.dragHandle?.ariaLabel}
        tabIndex={isExpandable && !disabled ? 0 : -1}
        onClick={isExpandable ? handleToggle : undefined}
        onKeyDown={isExpandable ? handleKeyDown : undefined}
        onPointerDown={isDraggable ? header.dragHandle?.onPointerDown : undefined}
        style={{ cursor: isDraggable ? 'grab' : (isExpandable ? 'pointer' : 'default') }}
      >
        {indicatorPos === 'start' && indicator}

        <div className={styles.headerContent}>
          {/* #section leading */}
          <div className={styles.leading}>
            {renderAvatar()}
            {header.leadingEmoji && <span>{header.leadingEmoji}</span>}
          </div>
          {/* #end-section */}

          {/* #section title block */}
          <div className={styles.titleBlock}>
            <div className={styles.title}>{header.title}</div>
            {header.subtitle && <div className={styles.subtitle}>{header.subtitle}</div>}
          </div>
          {/* #end-section */}

          {/* #section right buttons */}
          {renderRightButtons()}
          {/* #end-section */}
        </div>

        {indicatorPos === 'end' && indicator}
      </div>
      {/* #end-section */}

      {/* #section content */}
      {isExpandable && (
        <div
          id={`acc-content-${id || 'auto'}`}
          className={`${styles.content} ${isExpanded ? styles.contentExpanded : ''} ${contentClassName}`}
          role="region"
          aria-hidden={!isExpanded}
        >
          {(keepContentMounted || isExpanded) && <div className={styles.contentInner}>{children}</div>}
        </div>
      )}
      {/* #end-section */}
    </div>
  );
  // #end-section
};
// #end-component
export default Accordion;
