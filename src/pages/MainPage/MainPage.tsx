// src/pages/MainPage/MainPage.tsx
// #section Imports
import styles from './MainPage.module.css';
import '/src/styles/button.css';
import '/src/styles/modal.css';
import AppHeader from '../../components/AppHeader';

// #end-section

// #component MainPage
const MainPage = () => {


  // const userLogoUrl = `${import.meta.env.BASE_URL}${`user.svg`}`;
  const appLogoUrl = `${import.meta.env.BASE_URL}${`page_icon.jpg`}`;

  // #section return
  return (
    <div className={styles['page-container']}>
      {/* #section Header */}
      <AppHeader 
        appLogoUrl={appLogoUrl} 
        appName='Kitchen Solutions' 
        onLogin={()=>{console.log('login-click 🎲')}}
        onLogout={()=>{}}
      />
      {/* #end-section */}
    </div>
  );
  // #end-section
};

export default MainPage;
// #end-component
