/* src/pages/EmployeeDashboardPage/EmployeeDashboardPage.tsx */
// #section Imports
import { useUserDataStore } from '../../store/UserData.store';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../services/authentication/authentication';
import styles from './EmployeeDashboardPage.module.css';
import '/src/styles/button.css';
// #end-section
// #component EmployeeDashboardPage
/**
 * Página temporal de dashboard para empleados.
 * 
 * Muestra la información básica del empleado conectado para verificar
 * que el registro por invitación funcionó correctamente.
 * 
 * NOTA: Esta es una página temporal de prueba. En producción deberá
 * reemplazarse por un dashboard funcional con las herramientas del empleado.
 */
const EmployeeDashboardPage = () => {
  const firstName = useUserDataStore(s => s.firstName);
  const lastName = useUserDataStore(s => s.lastName);
  const email = useUserDataStore(s => s.email);
  const type = useUserDataStore(s => s.type);
  const state = useUserDataStore(s => s.state);
  const branchName = useUserDataStore(s => s.branchName);
  const companyName = useUserDataStore(s => s.companyName);
  const companyLogoUrl = useUserDataStore(s => s.companyLogoUrl);
  const isAuthenticated = useUserDataStore(s => s.isAuthenticated);
  const reset = useUserDataStore(s => s.reset);
  const navigate = useNavigate();

  // #debug - verificar datos de compañía
  console.log('🏢 Company Data:', {
    companyName,
    branchName,
    companyLogoUrl,
  });
  // #end-debug

  // #function handleLogout
  const handleLogout = async () => {
    try {
      await logoutUser();
      reset();
      navigate('/');
    } catch (error) {
      console.error('[EmployeeDashboardPage] Error al cerrar sesión:', error);
    }
  };
  // #end-function

  // #section Guard - redirect if not employee
  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <p>Cargando datos del usuario...</p>
      </div>
    );
  }

  if (type !== 'employee') {
    return (
      <div className={styles.container}>
        <div className={styles.errorBox}>
          <h2>Acceso denegado</h2>
          <p>Esta página es solo para empleados.</p>
          <button
            className="button button-primary"
            onClick={() => navigate('/dashboard')}
          >
            Ir al Dashboard
          </button>
        </div>
      </div>
    );
  }
  // #end-section

  // #section Render employee dashboard
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>🎉 Dashboard de Empleado</h1>
          <p className={styles.subtitle}>Registro exitoso</p>
        </div>

        {/* #section Company Info */}
        {(companyName || companyLogoUrl) && (
          <div className={styles.companySection}>
            {companyLogoUrl && (
              <img 
                src={companyLogoUrl} 
                alt={companyName || 'Logo de la compañía'} 
                className={styles.companyLogo}
              />
            )}
            <div className={styles.companyInfo}>
              {companyName && (
                <div className={styles.companyName}>{companyName}</div>
              )}
              {branchName && (
                <div className={styles.branchName}>{branchName}</div>
              )}
            </div>
          </div>
        )}
        {/* #end-section */}

        <div className={styles.infoSection}>
          <h2>Información del Usuario</h2>
          
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Nombre:</span>
              <span className={styles.value}>{firstName} {lastName}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.label}>Email:</span>
              <span className={styles.value}>{email}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.label}>Tipo de usuario:</span>
              <span className={`${styles.value} ${styles.badge}`}>
                {type}
              </span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.label}>Estado:</span>
              <span className={`${styles.value} ${styles.badge}`}>
                {state}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className="button button-secondary"
            onClick={handleLogout}
          >
            Cerrar Sesión
          </button>
        </div>

        <div className={styles.noteBox}>
          <p>
            <strong>Nota:</strong> Esta es una página temporal de prueba.
            En producción, aquí se mostrarán las herramientas y funcionalidades
            disponibles para el empleado según sus permisos.
          </p>
        </div>
      </div>
    </div>
  );
  // #end-section
};
// #end-component

export default EmployeeDashboardPage;
