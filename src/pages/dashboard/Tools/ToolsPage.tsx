/* src/pages/dashboard/Tools/ToolsPage.tsx */
import { Link } from 'react-router-dom';
import './ToolsPage.module.css';

export default function ToolsPage() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Herramientas</h2>
      <p>Selecciona una herramienta:</p>
      <ul>
        <li><Link to="/dashboard/tools/qr">QR Creator</Link></li>
      </ul>
    </div>
  );
}
