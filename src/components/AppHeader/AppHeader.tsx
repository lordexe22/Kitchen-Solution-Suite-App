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
import { useDropdown } from './AppHeader.hooks';
import { getInitials } from './AppHeader.utils';
// #end-section
// #component AppHeader
/**
 * Componente de header de la aplicación
 * Muestra logo, título y opciones de autenticación/usuario
 */
const AppHeader = (props: AppHeaderProps) => {

  const user = useUserDataStore();
  const {appLogoUrl, appName} = props;

  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  
  // Hook para manejar el dropdown del menú de usuario
  const { isOpen, toggle, dropdownRef, handleItemClick } = useDropdown();

  console.log('📊 Store actual en AppHeader:', user);

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
        <div className={styles['header-right']}>
          {!user.isAuthenticated ? (
            <>
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
            </>
          ) : (
            <>
              {/* #section Logged In */}
              {/* Email del usuario */}
              <span className={styles['user-name']}>{user.email}</span>
              
              {/* Avatar del usuario */}
              {user.imageUrl ? (
                <img 
                  src={user.imageUrl} 
                  alt={`${user.firstName} ${user.lastName}`}
                  className={styles['user-avatar']}
                />
              ) : (
                <div className={styles['user-avatar-placeholder']}>
                  {getInitials(`${user.firstName} ${user.lastName}`)}
                </div>
              )}

              {/* Dropdown Menu */}
              <div className={styles['dropdown-container']} ref={dropdownRef}>
                <button
                  className={styles['btn-dropdown']}
                  onClick={toggle}
                  aria-label="User menu"
                  aria-expanded={isOpen}
                >
                  <span className={styles['dropdown-arrow']}>▼</span>
                </button>

                {isOpen && (
                  <div className={styles['dropdown-menu']}>
                    {/* User Info en el dropdown */}
                    <div className={styles['dropdown-user-info']}>
                      <div className={styles['dropdown-user-name']}>
                        {user.firstName} {user.lastName}
                      </div>
                      <div className={styles['dropdown-user-email']}>
                        {user.email}
                      </div>
                    </div>

                    {/* Lista de opciones */}
                    <ul className={styles['dropdown-list']}>
                      <li>
                        <button
                          className={styles['dropdown-item']}
                          onClick={() => handleItemClick(() => {
                            // Por ahora no hace nada
                            console.log('Logout clicked (no action yet)');
                          })}
                        >
                          <span className={styles['dropdown-item-icon']}>🚪</span>
                          <span className={styles['dropdown-item-label']}>Cerrar sesión</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              {/* #end-section */}
            </>
          )}
        </div>
        {/* #end-section */}
      </header>
      {/* #section showRegisterModal */}
      { 
        showRegisterModal && 
        <AuthRegisterModalWindow
          onCloseModal={()=>{setShowRegisterModal(false)}}
        />
      }
      {/* #end-section */}
      {/* #section showLoginModal */}
      {
        showLoginModal && 
        <AuthLoginModalWindow
          onCloseModal={()=>{setShowLoginModal(false)}}
        />
      }
      {/* #end-section */}
    </>
  );
  // #end-section
};

export default AppHeader;
// #end-component
