/* src/components/DashboardShell/DashboardShell.tsx */
import React from 'react';
import AppHeader from '../../components/AppHeader';
import DashboardNavbar from '../../components/DashboardNavbar';
import styles from '../../pages/dashboard/WelcomePage/WelcomePage.module.css';

type Props = {
  children: React.ReactNode;
};

export default function DashboardShell({ children }: Props) {
  const appLogoUrl = `${import.meta.env.BASE_URL}page_icon.jpg`;
  return (
    <div className={styles.container}>
      <AppHeader appLogoUrl={appLogoUrl} appName="Kitchen Solutions" onLogin={() => {}} onLogout={() => {}} />
      <div className={styles.content}>
        <DashboardNavbar />
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
