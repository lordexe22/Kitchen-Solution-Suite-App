// #section Imports
import { useMemo } from 'react';
import type { AppHeaderProps } from './AppHeader.types';
import { useDropdown } from './AppHeader.hooks';
import {
  APP_HEADER_TEXTS,
  APP_HEADER_ICONS,
  APP_HEADER_CONFIG,
  createDropdownMenuItems,
} from './AppHeader.config';
import {
  getInitials,
  getUserDisplayText,
  getAvatarSrc,
} from './AppHeader.utils';
import styles from './AppHeader.module.css';
import '/src/styles/button.css';
// #end-section

// #component AppHeader
/**
 * Componente de header de la aplicación
 * Muestra logo, título y opciones de autenticación/usuario
 */
const AppHeader = (props: AppHeaderProps) => {
  const {
    appLogoUrl,
    appName,
    user,
    onLoginClick,
    onLogout,
    onNotificationsClick,
    onProfileClick,
    onSettingsClick,
  } = props;

  // #hook useDropdown
  const {
    isOpen,
    toggle,
    dropdownRef,
    handleItemClick,
  } = useDropdown({
    closeOnClickOutside: true,
    closeOnEscape: true,
    closeOnItemClick: APP_HEADER_CONFIG.closeDropdownOnItemClick,
  });
  // #end-hook

  // #memo dropdownMenuItems
  const dropdownMenuItems = useMemo(() => {
    return createDropdownMenuItems({
      onProfileClick,
      onSettingsClick,
      onLogout,
    });
  }, [onProfileClick, onSettingsClick, onLogout]);
  // #end-memo

  // #memo userDisplayText
  const userDisplayText = useMemo(() => {
    if (!user) return '';
    return getUserDisplayText(user, APP_HEADER_CONFIG.userDisplayMode);
  }, [user]);
  // #end-memo

  // #memo avatarSrc
  const avatarSrc = useMemo(() => {
    return getAvatarSrc(
      user?.avatarUrl,
      APP_HEADER_ICONS.defaultUserIcon,
      import.meta.env.BASE_URL
    );
  }, [user]);
  // #end-memo

  // #memo userInitials
  const userInitials = useMemo(() => {
    if (!user) return '';
    return getInitials(user.name);
  }, [user]);
  // #end-memo

  // #section return
  return (
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
        {user === null ? (
          /* #section Not Logged In */
          <button
            className={`btn-sec btn-lg ${styles['btn-login']}`}
            onClick={onLoginClick}
            aria-label={APP_HEADER_TEXTS.loginButton}
          >
            <img
              className="btn-icon"
              src={avatarSrc}
              alt="User icon"
            />
            <span>{APP_HEADER_TEXTS.loginButton}</span>
          </button>
          /* #end-section */
        ) : (
          /* #section Logged In */
          <>
            {/* #section User Info */}
            <div className={styles['user-info']}>
              {user.avatarUrl ? (
                <img
                  className={styles['user-avatar']}
                  src={avatarSrc}
                  alt={user.name}
                />
              ) : (
                <div className={styles['user-avatar-placeholder']}>
                  {userInitials}
                </div>
              )}
              <span className={styles['user-name']}>{userDisplayText}</span>
            </div>
            {/* #end-section */}

            {/* #section Notifications Button */}
            {onNotificationsClick && (
              <button
                className={styles['btn-notifications']}
                onClick={onNotificationsClick}
                aria-label={APP_HEADER_TEXTS.notificationsButton}
                title={APP_HEADER_TEXTS.notificationsButton}
              >
                {APP_HEADER_ICONS.notificationIcon}
              </button>
            )}
            {/* #end-section */}

            {/* #section Dropdown Menu */}
            <div className={styles['dropdown-container']} ref={dropdownRef}>
              <button
                className={styles['btn-dropdown']}
                onClick={toggle}
                aria-label="Menú de usuario"
                aria-expanded={isOpen}
              >
                {APP_HEADER_CONFIG.showDropdownArrow && (
                  <span className={styles['dropdown-arrow']}>
                    {APP_HEADER_ICONS.dropdownArrow}
                  </span>
                )}
              </button>

              {isOpen && (
                <div className={styles['dropdown-menu']}>
                  {/* #section User Info in Dropdown */}
                  {APP_HEADER_CONFIG.showEmailInDropdown && (
                    <div className={styles['dropdown-user-info']}>
                      <div className={styles['dropdown-user-name']}>
                        {user.name}
                      </div>
                      <div className={styles['dropdown-user-email']}>
                        {user.email}
                      </div>
                    </div>
                  )}
                  {/* #end-section */}

                  {/* #section Dropdown Items */}
                  <ul className={styles['dropdown-list']}>
                    {dropdownMenuItems.map((item) => {
                      if (item.isDivider) {
                        return (
                          <li
                            key={item.id}
                            className={styles['dropdown-divider']}
                            role="separator"
                          />
                        );
                      }

                      return (
                        <li key={item.id}>
                          <button
                            className={styles['dropdown-item']}
                            onClick={() => handleItemClick(item.onClick)}
                            disabled={item.disabled}
                            aria-label={item.label}
                          >
                            {item.icon && (
                              <span className={styles['dropdown-item-icon']}>
                                {item.icon}
                              </span>
                            )}
                            <span className={styles['dropdown-item-label']}>
                              {item.label}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  {/* #end-section */}
                </div>
              )}
            </div>
            {/* #end-section */}
          </>
          /* #end-section */
        )}
      </div>
      {/* #end-section */}
    </header>
  );
  // #end-section
};

export default AppHeader;
// #end-component