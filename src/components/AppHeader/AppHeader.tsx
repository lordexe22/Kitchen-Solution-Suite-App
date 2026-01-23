/* src/components/AppHeader/AppHeader.tsx */
// #section imports
import { useState } from 'react';
import type { AppHeaderProps } from './AppHeader.types';
import { APP_HEADER_TEXTS } from './AppHeader.config';
import styles from './AppHeader.module.css';
import '/src/styles/button.css';
import { useUserDataStore } from '../../store/userData/UserData.store';
import AuthRegisterModalWindow from '../AuthRegisterModalWindow/AuthRegisterModalWindow';
import AuthLoginModalWindow from '../AuthLoginModalWindow/AuthLoginModalWindow';
import SettingsModal from '../SettingsModal/SettingsModal';
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
  const { user, isHydrated, logout } = useUserDataStore();
  const userType = useUserDataStore(s => s.user?.type ?? null);
  // #end-state

  // #state showRegisterModal, showLoginModal, showSettingsModal, isLoggingOut
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
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
      logout(); // Clear user store data
      close(); // Close dropdown
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
      logout(); // Clear store even if logout API fails
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
          {!isHydrated || !user ? (
            <>
              {/* #section Botones de Login y Register */}
              <button 
                className="btn-pri btn-md"
                onClick={()=>{setShowLoginModal(true)}}
              >
                <span className={styles['btn-login']}>
                  <span>{APP_HEADER_TEXTS.loginButton}</span>
                  <span>🔐</span>
                </span>
              </button>
              <button 
                className="btn-sec btn-md"
                onClick={()=>{setShowRegisterModal(true)}}
              >
                {APP_HEADER_TEXTS.registerButton}
              </button>
              {/* #end-section */}
            </>
          ) : (
            <>
              {/* #section User Info + Dropdown */}
              <div className={styles['user-info']}>
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
                <span className={styles['user-name']}>
                  {user.firstName} {user.lastName}
                </span>
              </div>

              <div className={styles['user-dropdown-container']} ref={dropdownRef}>
                <button 
                  className={styles['dropdown-toggle']}
                  onClick={toggle}
                  aria-label="User menu"
                >
                  {isOpen ? '▲' : '▼'}
                </button>

                {isOpen && (
                  <div className={styles['dropdown-menu']}>
                    <ul>
                      <li>
                        <button
                          onClick={() => handleItemClick(() => console.log('Mi perfil'))}
                          className={styles['dropdown-item']}
                        >
                          <span className={styles['icon']}>👤</span>
                          {APP_HEADER_TEXTS.profileMenu}
                        </button>
                      </li>
                      {/* Mis compañías: solo para admin */}
                      {userType === 'admin' && (
                        <li>
                          <button
                            onClick={() => handleItemClick(() => console.log('Mis compañías'))}
                            className={styles['dropdown-item']}
                          >
                            <span className={styles['icon']}>🏢</span>
                            Mis compañías
                          </button>
                        </li>
                      )}
                      {/* Configuración: solo para admin */}
                      {userType === 'admin' && (
                        <li>
                          <button
                            onClick={() => handleItemClick(() => setShowSettingsModal(true))}
                            className={styles['dropdown-item']}
                          >
                            <span className={styles['icon']}>⚙️</span>
                            {APP_HEADER_TEXTS.settingsMenu}
                          </button>
                        </li>
                      )}
                      <li className={styles['dropdown-divider']}></li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className={styles['dropdown-item']}
                          disabled={isLoggingOut}
                        >
                          <span className={styles['icon']}>🚪</span>
                          <span className={isLoggingOut ? styles['logging-out'] : ''}>
                            {isLoggingOut ? 'Cerrando sesión...' : APP_HEADER_TEXTS.logoutButton}
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
          onCloseModal={() => {setShowRegisterModal(false)}}
        />
      }
      {/* #end-section */}

      {/* #section showLoginModal */}
      {
        showLoginModal && 
        <AuthLoginModalWindow
          onCloseModal={() => {setShowLoginModal(false)}}
        />
      }
      {/* #end-section */}

      {/* #section showSettingsModal */}
      {
        showSettingsModal && 
        <SettingsModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
        />
      }
      {/* #end-section */}
    </>
  );
  // #end-section
};

export default AppHeader;
// #end-component
