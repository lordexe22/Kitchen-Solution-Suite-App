// #section Imports
import type { AppHeaderProps } from './AppHeader.types';
import {
  APP_HEADER_TEXTS,
} from './AppHeader.config';
import styles from './AppHeader.module.css';
import '/src/styles/button.css';
import { useUserDataStore } from '../../store/UserData.store';
import { useState } from 'react';
import AuthRegisterModalWindow from '../AuthRegisterModalWindow/AuthRegisterModalWindow';
import AuthLoginModalWindow from '../AuthLoginModalWindow/AuthLoginModalWindow';
// #end-section

// #component AppHeader
/**
 * Componente de header de la aplicación
 * Muestra logo, título y opciones de autenticación/usuario
 */
const AppHeader = (props: AppHeaderProps) => {

  const user = useUserDataStore();
  const {appLogoUrl, appName} = props;

  // const avatarSrc = '/Kitchen-Solution-Suite-App/public/user.svg'

  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  

  // #section return
  return (
    <>
      <header className={styles['header']}>
        {/* #section Header Left */}
        <div className={styles['header-left']}>
          <div className={styles['header-logo']}>
            <img src={appLogoUrl} alt={`${appName} logo`} />
          </div>
          <h1 className={styles['header-title']}>{appName}</h1>
        </div>
        {/* #end-section */}
        {/* #section Header Right */}
          {user?.isAuthenticated === false && (
            <div className={styles['header-right']}>
                {/* #section Not Logged In */}
                <button
                  className={`btn-pri btn-lg ${styles['btn-login']}`}
                  onClick={()=>{setShowLoginModal(true)}}
                  aria-label={APP_HEADER_TEXTS.loginButton}
                >
                  <span>{APP_HEADER_TEXTS.loginButton}</span>
                </button>
                <button
                  className={`btn-sec btn-lg ${styles['btn-login']}`}
                  onClick={()=>{setShowRegisterModal(true)}}
                  aria-label={APP_HEADER_TEXTS.registerButton}
                >
                  <span>{APP_HEADER_TEXTS.registerButton}</span>
                </button>
                {/* #end-section */}
            </div>
          )}
        {/* #end-section */}
      </header>
      { 
        showRegisterModal && 
        <AuthRegisterModalWindow
          onCloseModal={()=>{setShowRegisterModal(false)}}
        />
      }
      {
        showLoginModal && 
        <AuthLoginModalWindow
          onCloseModal={()=>{setShowLoginModal(false)}}
        />
      }
    </>
  );
  // #end-section
};

export default AppHeader;
// #end-component