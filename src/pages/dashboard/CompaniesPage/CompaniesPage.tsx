// src/pages/dashboard/CompaniesPage/CompaniesPage.tsx
import AppHeader from '../../../components/AppHeader';
import DashboardNavbar from '../../../components/DashboardNavbar';
import styles from './CompaniesPage.module.css';

const CompaniesPage = () => {
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
          <h1 className={styles.title}>Compañías</h1>
        </main>
      </div>
    </div>
  );
};

export default CompaniesPage;