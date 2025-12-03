/* src/components/_demos/AccordionDemo.tsx */
import React, { useState } from 'react';
import { Accordion } from '../../modules/accordion/Accordion';

/**
 * Demo completo del módulo Accordion - Actualizado
 * Muestra todas las capacidades del componente con ejemplos prácticos y relevantes
 */
export const AccordionDemo: React.FC = () => {
  // Estado para ejemplos interactivos
  const [controlledId, setControlledId] = useState<string | null>('ctrl-1');
  const [formData, setFormData] = useState({ name: '', email: '' });
  
  // Drag & Drop para reordenamiento
  const [projects, setProjects] = useState([
    { id: 'p1', name: 'Kitchen Suite App', status: 'En progreso', emoji: '🍽️' },
    { id: 'p2', name: 'Dashboard Analytics', status: 'Completado', emoji: '📊' },
    { id: 'p3', name: 'Mobile App', status: 'Planeado', emoji: '📱' },
  ]);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const handleDragStart = (idx: number) => () => setDraggedIdx(idx);
  const handleDragOver = (idx: number) => (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;
    const items = [...projects];
    const [dragged] = items.splice(draggedIdx, 1);
    items.splice(idx, 0, dragged);
    setProjects(items);
    setDraggedIdx(idx);
  };
  const handleDragEnd = () => setDraggedIdx(null);

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
      {/* HEADER */}
      <header>
        <h1 style={{ margin: 0, fontSize: '2rem' }}>Accordion Module</h1>
        <p style={{ color: '#666', marginTop: '0.5rem', fontSize: '1rem' }}>
          Componente de acordeón production-ready con estado controlado, drag & drop, variantes visuales y customización completa.
        </p>
      </header>

      {/* ========== SECCIÓN 1: CASOS BÁSICOS ========== */}
      <section>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>1. Casos Básicos</h2>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          Configuraciones esenciales para comenzar a usar el componente.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Accordion
            id="basic-1"
            header={{ title: 'Acordeón Simple' }}
            defaultExpanded
          >
            <p>Contenido básico expandido por defecto.</p>
          </Accordion>
          
          <Accordion
            id="basic-2"
            header={{
              title: 'Con Subtítulo y Emoji',
              subtitle: '24 items · Última actualización hace 2 horas',
              leadingEmoji: '📦',
            }}
          >
            <p>El subtítulo es ideal para metadata como contadores, fechas o estados.</p>
          </Accordion>

          <Accordion
            id="basic-3"
            expandable={false}
            header={{
              title: 'Bloque No Expandible',
              subtitle: 'Siempre visible, útil para headers informativos',
            }}
          >
            <p>Este contenido siempre está visible. Útil como banner o header de sección.</p>
          </Accordion>
        </div>
      </section>

      {/* ========== SECCIÓN 2: AVATARES Y LOGOS ========== */}
      <section>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>2. Avatares y Logos</h2>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          Soporte para imágenes con fallback automático a iniciales. El espacio solo se reserva cuando hay avatar configurado.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Accordion
            id="logo-1"
            header={{
              title: 'TechCorp Solutions',
              subtitle: 'Proveedor de software empresarial',
              avatar: {
                src: 'https://ui-avatars.com/api/?name=TechCorp&background=0ea5e9&color=fff&size=60',
                alt: 'TechCorp',
              },
            }}
          >
            <div style={{ padding: '0.5rem 0' }}>
              <p><strong>Dirección:</strong> Av. Principal 123, CDMX</p>
              <p><strong>Teléfono:</strong> +52 55 1234 5678</p>
            </div>
          </Accordion>
          
          <Accordion
            id="logo-2"
            header={{
              title: 'María González',
              subtitle: 'Gerente de Proyectos',
              avatar: {
                src: 'url-invalida',
                alt: 'María González',
              },
            }}
          >
            <p>Fallback automático: cuando la imagen falla, se muestran las iniciales "MG".</p>
          </Accordion>
        </div>
      </section>

      {/* ========== SECCIÓN 3: VARIANTES VISUALES ========== */}
      <section>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>3. Variantes Visuales</h2>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          5 estilos predefinidos para diferentes contextos. Combínalos con <code>customStyles</code> para personalizaciones avanzadas.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          <Accordion variant="default" id="v1" header={{ title: 'Default' }}>
            <p>Estilo estándar con borde y fondo gris claro.</p>
          </Accordion>
          <Accordion variant="compact" id="v2" header={{ title: 'Compact' }}>
            <p>Padding reducido para listas densas.</p>
          </Accordion>
          <Accordion variant="elevated" id="v3" header={{ title: 'Elevated' }}>
            <p>Box-shadow para destacar.</p>
          </Accordion>
          <Accordion variant="minimal" id="v4" header={{ title: 'Minimal' }}>
            <p>Solo separador inferior.</p>
          </Accordion>
          <Accordion variant="outlined" id="v5" header={{ title: 'Outlined' }}>
            <p>Borde grueso, fondo transparente.</p>
          </Accordion>
        </div>
      </section>

      {/* ========== SECCIÓN 4: ESTADO CONTROLADO ========== */}
      <section>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>4. Estado Controlado (Accordion único)</h2>
        <p style={{ color: '#666', marginBottom: '1rem' }}>
          El componente padre controla qué acordeón está expandido, útil para comportamiento "solo uno a la vez".
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <button className="btn-sec btn-sm" onClick={() => setControlledId(null)}>Colapsar Todos</button>
          <button className="btn-sec btn-sm" onClick={() => setControlledId('ctrl-1')}>Sección 1</button>
          <button className="btn-sec btn-sm" onClick={() => setControlledId('ctrl-2')}>Sección 2</button>
          <button className="btn-sec btn-sm" onClick={() => setControlledId('ctrl-3')}>Sección 3</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { id: 'ctrl-1', title: 'Información General', content: 'Datos básicos del proyecto.' },
            { id: 'ctrl-2', title: 'Configuración', content: 'Opciones y preferencias del sistema.' },
            { id: 'ctrl-3', title: 'Permisos y Accesos', content: 'Gestión de roles y usuarios.' },
          ].map((item) => (
            <Accordion
              key={item.id}
              id={item.id}
              header={{
                title: item.title,
                subtitle: controlledId === item.id ? '✓ Expandido' : 'Click para expandir',
              }}
              isExpanded={controlledId === item.id}
              onToggle={(expanded) => setControlledId(expanded ? item.id : null)}
            >
              <p>{item.content}</p>
            </Accordion>
          ))}
        </div>
      </section>

      {/* ========== SECCIÓN 5: DRAG & DROP ========== */}
      <section>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>5. Drag & Drop para Reordenamiento</h2>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          El header es draggable cuando está colapsado. El padre maneja la lógica de reordenamiento.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {projects.map((proj, idx) => (
            <div
              key={proj.id}
              draggable
              onDragStart={handleDragStart(idx)}
              onDragOver={handleDragOver(idx)}
              onDragEnd={handleDragEnd}
              style={{ 
                opacity: draggedIdx === idx ? 0.5 : 1,
                transition: 'opacity 0.2s ease'
              }}
            >
              <Accordion
                id={proj.id}
                header={{
                  title: `${idx + 1}. ${proj.name}`,
                  subtitle: proj.status,
                  leadingEmoji: proj.emoji,
                  dragHandle: { ariaLabel: `Reordenar ${proj.name}` },
                }}
              >
                <p>Contenido del proyecto. Arrastra desde el header para cambiar el orden.</p>
              </Accordion>
            </div>
          ))}
        </div>
      </section>

      {/* ========== SECCIÓN 6: RIGHT BUTTONS ========== */}
      <section>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>6. Botones de Acción (Right Buttons)</h2>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          Botones configurables con tooltips, layouts flexibles y soporte para componentes custom.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Botones inline con tooltips */}
          <Accordion
            id="rb-1"
            header={{ title: 'Sucursal Centro', subtitle: 'Av. Reforma 456' }}
            rightButtons={[
              { id: 'edit', icon: '✏️', ariaLabel: 'Editar', tooltip: 'Editar sucursal', onClick: () => alert('Editar') },
              { id: 'delete', icon: '🗑️', ariaLabel: 'Eliminar', tooltip: 'Eliminar sucursal', onClick: () => alert('Eliminar') },
              { id: 'settings', icon: '⚙️', ariaLabel: 'Configurar', tooltip: 'Configuración', onClick: () => alert('Config') },
            ]}
            rightButtonsLayout={{ rows: 1, gap: 6 }}
            rightButtonsVariant="soft"
          >
            <p>Botones con variante "soft" (fondo gris claro).</p>
          </Accordion>

          {/* Sin indicador pero con botones */}
          <Accordion
            id="rb-2"
            header={{ 
              title: 'Sin Flecha (no expandible)',
              subtitle: 'Los botones ocupan todo el espacio derecho',
              indicator: { hidden: true }
            }}
            expandable={false}
            rightButtons={[
              { id: 'share', label: 'Compartir', tooltip: 'Compartir elemento', onClick: () => {} },
              { id: 'export', label: 'Exportar', tooltip: 'Exportar datos', onClick: () => {} },
            ]}
            rightButtonsLayout={{ rows: 1, gap: 8 }}
          >
            <p>Útil como item de lista con acciones pero sin contenido expandible.</p>
          </Accordion>

          {/* Grid de botones */}
          <Accordion
            id="rb-3"
            header={{ title: 'Grid de Acciones', subtitle: '4 botones en grid 2x2' }}
            rightButtons={[
              { id: 'a', icon: '📝', ariaLabel: 'Editar', onClick: () => {} },
              { id: 'b', icon: '📋', ariaLabel: 'Copiar', onClick: () => {} },
              { id: 'c', icon: '📤', ariaLabel: 'Compartir', onClick: () => {} },
              { id: 'd', icon: '🗑️', ariaLabel: 'Eliminar', onClick: () => {} },
            ]}
            rightButtonsLayout={{ rows: 2, cols: 2, gap: 4 }}
          >
            <p>Layout grid explícito: 2 filas × 2 columnas. Útil para múltiples acciones compactas.</p>
          </Accordion>

          {/* Orden RTL/LTR */}
          <Accordion
            id="rb-4"
            header={{ title: 'Orden LTR (izquierda a derecha)', subtitle: 'Cambia el orden de renderizado' }}
            rightButtons={[
              { id: 'first', label: '1º', onClick: () => {} },
              { id: 'second', label: '2º', onClick: () => {} },
              { id: 'third', label: '3º', onClick: () => {} },
            ]}
            rightButtonsLayout={{ rows: 1, gap: 6 }}
            rightButtonsOrder={{ horizontal: 'ltr' }}
          >
            <p>Por defecto los botones se ordenan RTL (derecha a izquierda). Aquí se invierte a LTR.</p>
          </Accordion>

          {/* Componente custom */}
          <Accordion
            id="rb-5"
            header={{ title: 'Botón Custom Component' }}
            rightButtons={[
              <button
                key="custom"
                className="btn-primary btn-sm"
                onClick={() => alert('Custom!')}
                style={{ marginRight: '4px' }}
              >
                Custom
              </button>,
              { id: 'std', icon: '✓', ariaLabel: 'Standard', onClick: () => {} },
            ]}
          >
            <p>Mezcla de botones custom (componentes React) y botones declarativos.</p>
          </Accordion>
        </div>
      </section>

      {/* ========== SECCIÓN 7: INDICADOR CONFIGURABLE ========== */}
      <section>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>7. Indicador de Expansión</h2>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          Personaliza el ícono, rotación y posición del indicador.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Accordion
            id="ind-1"
            header={{ 
              title: 'Indicador Start (izquierda)',
              indicator: { position: 'start', rotationDegrees: 90 }
            }}
          >
            <p>Flecha a la izquierda, rota 90° al expandir.</p>
          </Accordion>

          <Accordion
            id="ind-2"
            header={{ 
              title: 'Rotación 180° (arriba/abajo)',
              indicator: { rotationDegrees: 180, icon: '▼' }
            }}
          >
            <p>Ícono custom "▼" que rota 180° al expandir.</p>
          </Accordion>

          <Accordion
            id="ind-3"
            header={{ 
              title: 'Ícono Custom Emoji',
              indicator: { icon: '👉', rotationDegrees: 90 }
            }}
          >
            <p>Puedes usar cualquier emoji o caracter como indicador.</p>
          </Accordion>
        </div>
      </section>

      {/* ========== SECCIÓN 8: CUSTOMSTYLES ========== */}
      <section>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>8. Estilos Personalizados</h2>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          Override de variables CSS para temas custom o branding específico.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Accordion
            id="cs-1"
            header={{ title: 'Tema Azul Corporativo' }}
            customStyles={{
              headerBg: '#dbeafe',
              headerHoverBg: '#bfdbfe',
              contentBg: '#eff6ff',
              borderColor: '#3b82f6',
              titleColor: '#1e40af',
            }}
          >
            <p>Paleta azul para secciones corporativas.</p>
          </Accordion>

          <Accordion
            id="cs-2"
            header={{ title: 'Tema Verde Éxito' }}
            customStyles={{
              headerBg: '#dcfce7',
              headerHoverBg: '#bbf7d0',
              contentBg: '#f0fdf4',
              borderColor: '#22c55e',
              borderRadius: '12px',
            }}
          >
            <p>Border radius custom + colores verdes.</p>
          </Accordion>

          <Accordion
            id="cs-3"
            header={{ 
              title: 'Tema Oscuro',
              subtitle: 'Header con degradado'
            }}
            customStyles={{
              headerBg: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
              headerHoverBg: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
              contentBg: '#f9fafb',
              titleColor: '#ffffff',
              subtitleColor: '#d1d5db',
            }}
            defaultExpanded
          >
            <p>Usa gradientes CSS en headerBg para efectos avanzados.</p>
          </Accordion>
        </div>
      </section>

      {/* ========== SECCIÓN 9: KEEPCONTENTMOUNTED ========== */}
      <section>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>9. Preservar Estado (keepContentMounted)</h2>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          Mantén el contenido montado cuando se colapsa. Esencial para formularios y estados complejos.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Accordion
            id="km-false"
            header={{ 
              title: 'SIN keepContentMounted',
              subtitle: 'Contenido se destruye al colapsar'
            }}
            keepContentMounted={false}
            defaultExpanded
          >
            <input 
              type="text" 
              placeholder="Este valor se perderá al colapsar..." 
              style={{ width: '100%', padding: '8px', marginBottom: '8px' }} 
            />
            <p style={{ fontSize: '0.9rem', color: '#666' }}>
              ⚠️ Al colapsar, el DOM se desmonta y el estado del input se pierde.
            </p>
          </Accordion>

          <Accordion
            id="km-true"
            header={{ 
              title: 'CON keepContentMounted',
              subtitle: 'Contenido persiste aunque esté colapsado'
            }}
            keepContentMounted={true}
            defaultExpanded
          >
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Tu nombre..."
              style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
            />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Tu email..."
              style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
            />
            <p style={{ fontSize: '0.9rem', color: '#059669', marginTop: '8px' }}>
              ✓ Valores preservados: <strong>{formData.name || '(vacío)'}</strong> · <strong>{formData.email || '(vacío)'}</strong>
            </p>
          </Accordion>
        </div>
      </section>

      {/* ========== SECCIÓN 10: ESTADOS ESPECIALES ========== */}
      <section>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>10. Estados Especiales</h2>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          Disabled y transiciones personalizadas.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Accordion
            id="special-1"
            disabled
            header={{ 
              title: 'Acordeón Deshabilitado',
              subtitle: 'No responde a interacciones'
            }}
          >
            <p>Este contenido no es accesible.</p>
          </Accordion>

          <Accordion
            id="special-2"
            transitionDurationMs={800}
            header={{ 
              title: 'Transición Lenta (800ms)',
              subtitle: 'Animación de expansión más suave'
            }}
          >
            <p>Ajusta la velocidad de la animación con <code>transitionDurationMs</code>.</p>
          </Accordion>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb', textAlign: 'center', color: '#666' }}>
        <p>
          <strong>Accordion Module</strong> · Production-ready component · Kitchen Solutions Suite
        </p>
      </footer>
    </div>
  );
};

export default AccordionDemo;
