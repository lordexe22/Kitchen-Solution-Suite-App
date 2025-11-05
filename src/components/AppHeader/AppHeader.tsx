/* src\components\AppHeader\AppHeader.tsx */
// #section imports
import { useState } from 'react';
import type { AppHeaderProps } from './AppHeader.types';
import { APP_HEADER_TEXTS } from './AppHeader.config';
import styles from './AppHeader.module.css';
import '/src/styles/button.css';
import { useUserDataStore } from '../../store/UserData.store';
import AuthRegisterModalWindow from '../AuthRegisterModalWindow/AuthRegisterModalWindow';
import AuthLoginModalWindow from '../AuthLoginModalWindow/AuthLoginModalWindow';
import { useDropdown } from './AppHeader.hooks';
import { getInitials } from './AppHeader.utils';
import { logoutUser } from '../../services/authentication/authentication';
// #end-section
// #component AppHeader
/**
 * Componente de header de la aplicación
 * Muestra logo, título y opciones de autenticación/usuario
 */
const AppHeader = (props: AppHeaderProps) => {
  // #variable appLogoUrl, appName (props)
  const {appLogoUrl, appName} = props;
  // #end-variable
  // #state user (Zustand store)
  const user = useUserDataStore();
  // #end-state
  // #state showRegisterModal, showLoginModal, isLoggingOut
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  // #end-state
  // #hook useDropdown - dropdown menu for user options
  const { isOpen, toggle, dropdownRef, handleItemClick, close } = useDropdown();
  // #end-hook
  // #function handleLogout
  /**
   * Maneja el cierre de sesión del usuario.
   * 1. Llama al endpoint de logout
   * 2. Limpia el store de Zustand
   * 3. Cierra el dropdown
   */
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser(); // Call logout endpoint
      user.reset(); // Reset user store data
      close(); // Close dropdown
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
      user.reset(); // Clear store even if logout API fails
      close(); // Close dropdown      
      console.warn('⚠️ Error del servidor, pero sesión cerrada localmente');
    } finally {
      setIsLoggingOut(false); // Reset logout state
    }
  };
  // #end-function
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
              <span className={styles['user-name']}>{user.email}</span>
              
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
                    <div className={styles['dropdown-user-info']}>
                      <div className={styles['dropdown-user-name']}>
                        {user.firstName} {user.lastName}
                      </div>
                      <div className={styles['dropdown-user-email']}>
                        {user.email}
                      </div>
                    </div>

                    <ul className={styles['dropdown-list']}>
                      <li>
                        <button
                          className={styles['dropdown-item']}
                          onClick={() => handleItemClick(handleLogout)}
                          disabled={isLoggingOut}
                        >
                          <span className={styles['dropdown-item-icon']}>🚪</span>
                          <span className={styles['dropdown-item-label']}>
                            {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
                          </span>
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