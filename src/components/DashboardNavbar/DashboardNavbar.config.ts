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
    label: 'Mis Compañías',
    icon: '🏢',
    path: '/dashboard/branches/companies',
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
    path: '/dashboard/branches/products',
  },
  {
    id: 'location',
    label: 'Ubicación',
    icon: '📍',
    path: '/dashboard/branches/location',
  },
  {
    id: 'schedules',
    label: 'Horarios',
    icon: '🕐',
    path: '/dashboard/branches/schedules',
  },
  {
    id: 'socials',
    label: 'Redes Sociales',
    icon: '🌐',
    path: '/dashboard/branches/socials',
  },
  {
    id: 'tools',
    label: 'Herramientas',
    icon: '🔧',
    // children will be rendered as an accordion submenu in the navbar
    children: [
      {
        id: 'tools_qr',
        label: 'QR Creator',
        icon: '🔲',
        path: '/dashboard/tools/qr'
      },
      {
        id: 'tools_tags',
        label: 'Tag Creator',
        icon: '🏷️',
        path: '/dashboard/tools/tags'
      }
    ]
  },
];