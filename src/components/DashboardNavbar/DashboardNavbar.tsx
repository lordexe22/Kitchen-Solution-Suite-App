// src/components/DashboardNavbar/DashboardNavbar.tsx
import { NavLink, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from './DashboardNavbar.config';
import styles from './DashboardNavbar.module.css';
import { useState } from 'react';
import type { NavItem } from './DashboardNavbar.types';

/**
 * Componente de barra de navegación lateral del Dashboard
 */
const DashboardNavbar = () => {
  const location = useLocation();
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setOpenIds((s) => ({ ...s, [id]: !s[id] }));

  return (
    <nav className={styles.navbar}>
      {NAV_ITEMS.map((item: NavItem) => {
        // Render parent items that have children as an accordion
        if (item.children && item.children.length > 0) {
          const children = item.children as NavItem[];
          // active when any child path matches current location
          const isActive = children.some((c) => c.path ? location.pathname.startsWith(c.path) : false);
          return (
            <div key={item.id}>
              <div
                role="button"
                tabIndex={0}
                onClick={() => toggle(item.id)}
                onKeyDown={() => toggle(item.id)}
                className={`${styles['nav-item']} ${isActive ? styles['nav-item-active'] : ''}`}
              >
                <span className={styles['nav-icon']}>{item.icon}</span>
                <span className={styles['nav-label']}>{item.label}</span>
                <span>{openIds[item.id] ? '▾' : '▸'}</span>
              </div>
              {openIds[item.id] && (
                <div className={styles['nav-children']}>
                  {children.map((child) => (
                    <NavLink
                      key={child.id}
                      to={child.path || '#'}
                      className={({ isActive }) => `${styles['nav-item-child']} ${isActive ? styles['nav-item-active'] : ''}`}
                    >
                      <span className={styles['nav-icon']}>{child.icon}</span>
                      <span className={styles['nav-label']}>{child.label}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        }

        return (
          <NavLink
            key={item.id}
            to={item.path || '#'}
            end={item.path === '/dashboard'}
            className={({ isActive }) => `${styles['nav-item']} ${isActive ? styles['nav-item-active'] : ''}`}
          >
            <span className={styles['nav-icon']}>{item.icon}</span>
            <span className={styles['nav-label']}>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default DashboardNavbar;