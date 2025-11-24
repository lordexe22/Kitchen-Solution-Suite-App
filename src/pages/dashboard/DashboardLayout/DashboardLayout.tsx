/* src/pages/dashboard/DashboardLayout/DashboardLayout.tsx */
import { Outlet } from 'react-router-dom';
import AppHeader from '../../../components/AppHeader';
import DashboardNavbar from '../../../components/DashboardNavbar';
import styles from '../WelcomePage/WelcomePage.module.css';

export default function DashboardLayout() {
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
          <Outlet />
        </main>
      </div>
    </div>
  );
}
