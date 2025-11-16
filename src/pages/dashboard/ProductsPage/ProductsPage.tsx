// src/pages/dashboard/ProductsPage/ProductsPage.tsx
import AppHeader from '../../../components/AppHeader';
import DashboardNavbar from '../../../components/DashboardNavbar';
import styles from './ProductsPage.module.css';
import { TagCreatorModal } from '../../../modules/tagCreator';

const ProductsPage = () => {
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
        <TagCreatorModal isOpen={true} onClose={()=>{}} onConfirm={()=>{}}/>
        <main className={styles.main}>
          <h1 className={styles.title}>Productos</h1>
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;