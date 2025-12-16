// src/components/DashboardNavbar/DashboardNavbar.tsx
import { NavLink, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from './DashboardNavbar.config';
import styles from './DashboardNavbar.module.css';
import { useState, useMemo } from 'react';
import type { NavItem } from './DashboardNavbar.types';
import { useUserDataStore } from '../../store/UserData.store';
import { hasPermission } from '../../config/permissions.config';

const EMPLOYEE_NAV_PERMISSIONS: Partial<Record<string, { module: 'products' | 'schedules' | 'socials'; }>> = {
  products: { module: 'products' },
  schedules: { module: 'schedules' },
  socials: { module: 'socials' },
};
const EMPLOYEE_ALWAYS_VISIBLE = new Set(['welcome']);

/**
 * Componente de barra de navegación lateral del Dashboard
 * 
 * Lógica de visibilidad:
 * - Admin: ve todos los items
 * - Employee: no ve items del navbar (permisos se implementarán después)
 */
const DashboardNavbar = () => {
  const location = useLocation();
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({});
  const userType = useUserDataStore(s => s.type);
  const permissions = useUserDataStore(s => s.permissions);

  // #function filterNavItems - filtrar items según tipo de usuario
  const visibleItems = useMemo(() => {
    // Admin: acceso completo a todos los items
    if (userType === 'admin') {
      return NAV_ITEMS;
    }

    if (userType === 'employee') {
      return NAV_ITEMS
        .map((item) => {
          // No exponer items de admin (employees, companies, tools, location)
          const permissionRequirement = EMPLOYEE_NAV_PERMISSIONS[item.id];

          if (EMPLOYEE_ALWAYS_VISIBLE.has(item.id)) return item;
          if (!permissionRequirement) return null;

          const { module } = permissionRequirement;
          const canView = hasPermission(permissions, module, 'canView');
          const canEdit = hasPermission(permissions, module, 'canEdit');
          const allowed = canView || canEdit;
          return allowed ? item : null;
        })
        .filter(Boolean) as NavItem[];
    }

    return [];
  }, [permissions, userType]);
  // #end-function

  const toggle = (id: string) => setOpenIds((s) => ({ ...s, [id]: !s[id] }));

  return (
    <nav className={styles.navbar}>
      {visibleItems.map((item: NavItem) => {
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