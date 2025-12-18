// src/pages/dashboard/WelcomePage/WelcomePage.tsx
import AppHeader from '../../../components/AppHeader';
import DashboardNavbar from '../../../components/DashboardNavbar';
import { useUserDataStore } from '../../../store/UserData.store';
import styles from './WelcomePage.module.css';

const WelcomePage = () => {
  const appLogoUrl = `${import.meta.env.BASE_URL}page_icon.jpg`;
  const user = useUserDataStore();

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
          <h1 className={styles.title}>¡Bienvenido, {user.firstName}!</h1>
          
          {/* #section Company Info - Solo para empleados */}
          {user.type === 'employee' && (user.companyName || user.companyLogoUrl) && (
            <div className={styles['company-section']}>
              {user.companyLogoUrl && (
                <img 
                  src={user.companyLogoUrl} 
                  alt={user.companyName || 'Logo de la compañía'} 
                  className={styles['company-logo']}
                />
              )}
              <div className={styles['company-info']}>
                {user.companyName && (
                  <div className={styles['company-name']}>{user.companyName}</div>
                )}
                {user.branchName && (
                  <div className={styles['branch-name']}>{user.branchName}</div>
                )}
              </div>
            </div>
          )}
          {/* #end-section */}
          
          <div className={styles['user-info-card']}>
            <h2>Información del Usuario</h2>
            
            {user.imageUrl && (
              <img 
                src={user.imageUrl} 
                alt={`${user.firstName} ${user.lastName}`}
                className={styles.avatar}
              />
            )}
            
            <div className={styles['info-grid']}>
              <div className={styles['info-item']}>
                <span className={styles.label}>Nombre completo:</span>
                <span className={styles.value}>{user.firstName} {user.lastName}</span>
              </div>
              
              <div className={styles['info-item']}>
                <span className={styles.label}>Email:</span>
                <span className={styles.value}>{user.email}</span>
              </div>
              
              <div className={styles['info-item']}>
                <span className={styles.label}>Tipo de cuenta:</span>
                <span className={styles.value}>{user.type || 'N/A'}</span>
              </div>
              
              <div className={styles['info-item']}>
                <span className={styles.label}>Estado:</span>
                <span className={styles.value}>{user.state || 'N/A'}</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WelcomePage;