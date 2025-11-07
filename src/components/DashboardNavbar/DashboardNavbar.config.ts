// src/components/DashboardNavbar/DashboardNavbar.config.ts
import type { NavItem } from './DashboardNavbar.types';

/**
 * Items de navegación del Dashboard
 */
export const NAV_ITEMS: NavItem[] = [
  {
    id: 'welcome',
    label: 'Inicio',
    icon: '🏠',
    path: '/dashboard',
  },
  {
    id: 'companies',
    label: 'Compañías',
    icon: '🏢',
    path: '/dashboard/companies',
  },
  {
    id: 'employees',
    label: 'Empleados',
    icon: '👥',
    path: '/dashboard/employees',
  },
  {
    id: 'products',
    label: 'Productos',
    icon: '📦',
    path: '/dashboard/products',
  },
];