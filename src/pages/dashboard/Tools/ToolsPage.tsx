/* src/pages/dashboard/Tools/ToolsPage.tsx */
import { useState } from 'react';
import QRCreatorPage from './QRCreatorPage';
import TagCreatorPage from './TagCreatorPage';
import DevToolsPage from './DevToolsPage';
import styles from './ToolsPage.module.css';

// #component ToolsPage - Página principal de herramientas
/**
 * Página índice de herramientas disponibles.
 * Permite seleccionar entre QR Creator, Tag Creator y Dev Tools.
 */
function ToolsPage() {
  const [selectedTool, setSelectedTool] = useState<'qr' | 'tags' | 'dev' | null>(null);

  if (selectedTool === 'qr') {
    return (
      <div>
        <button onClick={() => setSelectedTool(null)} style={{ marginBottom: '1rem' }}>← Volver</button>
        <QRCreatorPage />
      </div>
    );
  }

  if (selectedTool === 'tags') {
    return (
      <div>
        <button onClick={() => setSelectedTool(null)} style={{ marginBottom: '1rem' }}>← Volver</button>
        <TagCreatorPage />
      </div>
    );
  }

  if (selectedTool === 'dev') {
    return (
      <div>
        <button onClick={() => setSelectedTool(null)} style={{ marginBottom: '1rem' }}>← Volver</button>
        <DevToolsPage />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Herramientas</h1>
      <div className={styles.toolsGrid}>
        <button className={styles.toolCard} onClick={() => setSelectedTool('qr')}>
          <span className={styles.toolIcon}>📱</span>
          <h3>QR Creator</h3>
          <p>Genera códigos QR para tus productos y sucursales</p>
        </button>

        <button className={styles.toolCard} onClick={() => setSelectedTool('tags')}>
          <span className={styles.toolIcon}>🏷️</span>
          <h3>Tag Creator</h3>
          <p>Crea etiquetas personalizadas para tus productos</p>
        </button>

        <button className={styles.toolCard} onClick={() => setSelectedTool('dev')}>
          <span className={styles.toolIcon}>⚙️</span>
          <h3>Dev Tools</h3>
          <p>Herramientas de desarrollo y depuración</p>
        </button>
      </div>
    </div>
  );
}

export default ToolsPage;
// #end-component
