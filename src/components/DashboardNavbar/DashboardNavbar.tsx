// src/components/DashboardNavbar/DashboardNavbar.tsx
import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from './DashboardNavbar.config';
import styles from './DashboardNavbar.module.css';

/**
 * Componente de barra de navegación lateral del Dashboard
 */
const DashboardNavbar = () => {
  return (
    <nav className={styles.navbar}>
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.id}
          to={item.path}
          end={item.path === '/dashboard'}
          className={({ isActive }) =>
            `${styles['nav-item']} ${isActive ? styles['nav-item-active'] : ''}`
          }
        >
          <span className={styles['nav-icon']}>{item.icon}</span>
          <span className={styles['nav-label']}>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default DashboardNavbar;