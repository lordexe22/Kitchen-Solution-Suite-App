// src/pages/dashboard/EmployeesPage/EmployeesPage.tsx
import AppHeader from '../../../components/AppHeader';
import DashboardNavbar from '../../../components/DashboardNavbar';
import { InvitationGenerator } from '../../../components/InvitationGenerator';
import type { InvitationResponse } from '../../../components/InvitationGenerator';
import EmployeeListByCompany from '../../../components/EmployeeListByCompany';
import styles from './EmployeesPage.module.css';
import EmptyState from '../../../components/EmptyState/EmptyState';
import { useUserDataStore } from '../../../store/UserData.store';

// #component EmployeesPage - página de gestión de empleados
/**
 * Página principal para la gestión de empleados
 * Permite a los ownership:
 * - Generar invitaciones para nuevos empleados
 * - Ver lista de invitaciones generadas
 * - Administrar empleados existentes y sus permisos
 */
const EmployeesPage = () => {
  const appLogoUrl = `${import.meta.env.BASE_URL}page_icon.jpg`;
  const userType = useUserDataStore(s => s.type);
  const canView = userType === 'admin' || userType === 'ownership';

  // #function handleInvitationGenerated - callback cuando se genera una invitación
  /**
   * Se ejecuta cuando InvitationGenerator crea exitosamente una invitación
   * Puede usarse para actualizar lista de invitaciones o mostrar notificación
   */
  const handleInvitationGenerated = (invitation: InvitationResponse) => {
    console.log('Nueva invitación generada:', invitation);
    // TODO: Actualizar lista de invitaciones cuando se implemente
  };
  // #end-function

  return (
    <div className={styles.container}>
      <AppHeader 
        appLogoUrl={appLogoUrl} 
        appName='Kitchen Solutions' 
        onLogin={() => {}}
        onLogout={() => {}}
      />
      <div className={styles.content}>
        <DashboardNavbar />
        <main className={styles.main}>
          {!canView && (
            <EmptyState
              title="Sin acceso"
              description="No tienes permisos para gestionar empleados."
              icon="🔒"
            />
          )}
          {canView && <h1 className={styles.title}>Empleados</h1>}
          
          {/* #section Invitation generator */}
          {canView && (
            <InvitationGenerator onInvitationGenerated={handleInvitationGenerated} />
          )}
          {/* #end-section */}

          {/* #section Employee list */}
          {canView && (
            <section className={styles.employeeListSection}>
              <h2 className={styles.sectionTitle}>Gestionar Empleados</h2>
              <EmployeeListByCompany />
            </section>
          )}
          {/* #end-section */}
        </main>
      </div>
    </div>
  );
};

export default EmployeesPage;
// #end-component