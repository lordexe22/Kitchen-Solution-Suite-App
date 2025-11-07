// src/pages/dashboard/EmployeesPage/EmployeesPage.tsx
import AppHeader from '../../../components/AppHeader';
import DashboardNavbar from '../../../components/DashboardNavbar';
import styles from './EmployeesPage.module.css';

const EmployeesPage = () => {
  const appLogoUrl = `${import.meta.env.BASE_URL}page_icon.jpg`;

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
          <h1 className={styles.title}>Empleados</h1>
        </main>
      </div>
    </div>
  );
};

export default EmployeesPage;