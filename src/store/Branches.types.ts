/* src/store/Branches.types.ts */
// #interface Branch
/**
 * Representa una sucursal en el frontend.
 * Replica la estructura de la tabla branches del backend.
 */
export interface Branch {
  id: number;
  companyId: number;
  name: string | null;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  deletedAt: string | null;
}
// #end-interface
// #interface BranchLocation
/**
 * Representa la ubicación física de una sucursal.
 */
export interface BranchLocation {
  id: number;
  branchId: number;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string | null;
  latitude: string | null;
  longitude: string | null;
  createdAt: string;
  updatedAt: string;
}
// #end-interface
// #interface BranchWithLocation
/**
 * Sucursal con su ubicación incluida (puede ser null si no tiene ubicación).
 */
export interface BranchWithLocation extends Branch {
  location: BranchLocation | null;
}
// #end-interface
// #interface BranchWithSchedules
/**
 * Sucursal con ubicación y horarios incluidos.
 */
export interface BranchWithSchedules extends BranchWithLocation {
  schedules?: BranchSchedule[];
}
// #end-interface
// #interface BranchWithSocials
/**
 * Sucursal con ubicación, horarios y redes sociales incluidas.
 */
export interface BranchWithSocials extends BranchWithSchedules {
  socials?: BranchSocial[];
}
// #end-interface
// #type BranchFormData
/**
 * Datos del formulario para crear/actualizar una sucursal.
 */
export type BranchFormData = {
  companyId: number;
  name?: string | null;
};
// #end-type
// #type BranchLocationFormData
/**
 * Datos del formulario para crear/actualizar una ubicación.
 */
export type BranchLocationFormData = {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  latitude?: string;
  longitude?: string;
};
// #end-type
// #interface BranchSocial
/**
 * Representa una red social de una sucursal.
 */
export interface BranchSocial {
  id: number;
  branchId: number;
  platform: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}
// #end-interface
// #type BranchSocialFormData
/**
 * Datos del formulario para crear/actualizar una red social.
 */
export type BranchSocialFormData = {
  platform: string;
  url: string;
};
// #end-type
// #type SocialPlatform
/**
 * Plataformas de redes sociales válidas.
 */
export type SocialPlatform = 
  | 'facebook'
  | 'instagram'
  | 'x'
  | 'tiktok'
  | 'youtube'
  | 'whatsapp'
  | 'website';
// #end-type
// #variable SOCIAL_PLATFORMS
/**
 * Lista de plataformas disponibles con metadata.
 */
export const SOCIAL_PLATFORMS: Array<{
  value: SocialPlatform;
  label: string;
  icon: string;
  placeholder: string;
}> = [
  { value: 'facebook', label: 'Facebook', icon: '📘', placeholder: 'https://facebook.com/tu-negocio' },
  { value: 'instagram', label: 'Instagram', icon: '📷', placeholder: 'https://instagram.com/tu-negocio' },
  { value: 'x', label: 'Twitter/X', icon: '🐦', placeholder: 'https://twitter.com/tu-negocio' },
  { value: 'tiktok', label: 'TikTok', icon: '🎵', placeholder: 'https://tiktok.com/@tu-negocio' },
  { value: 'youtube', label: 'YouTube', icon: '📹', placeholder: 'https://youtube.com/@tu-negocio' },
  { value: 'whatsapp', label: 'WhatsApp', icon: '💬', placeholder: 'https://wa.me/1234567890' },
  { value: 'website', label: 'Sitio Web', icon: '🌐', placeholder: 'https://tu-sitio-web.com' }
];
// #end-variable
// #interface BranchSchedule
/**
 * Representa un horario de atención de una sucursal.
 */
export interface BranchSchedule {
  id: number;
  branchId: number;
  dayOfWeek: DayOfWeek;
  openTime: string | null;
  closeTime: string | null;
  isClosed: boolean;
  createdAt: string;
  updatedAt: string;
}
// #end-interface
// #type DayOfWeek
/**
 * Días de la semana válidos.
 */
export type DayOfWeek = 
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';
// #end-type
// #type BranchScheduleFormData
/**
 * Datos del formulario para crear/actualizar un horario.
 */
export type BranchScheduleFormData = {
  dayOfWeek: DayOfWeek;
  openTime?: string | null;
  closeTime?: string | null;
  isClosed: boolean;
};
// #end-type
// #type BranchScheduleBatchData
/**
 * Datos para actualizar múltiples horarios a la vez.
 */
export type BranchScheduleBatchData = {
  schedules: BranchScheduleFormData[];
};
// #end-type
// #variable DAYS_OF_WEEK
/**
 * Lista de días de la semana con metadata para UI.
 */
export const DAYS_OF_WEEK: Array<{
  value: DayOfWeek;
  label: string;
  shortLabel: string;
}> = [
  { value: 'monday', label: 'Lunes', shortLabel: 'Lun' },
  { value: 'tuesday', label: 'Martes', shortLabel: 'Mar' },
  { value: 'wednesday', label: 'Miércoles', shortLabel: 'Mié' },
  { value: 'thursday', label: 'Jueves', shortLabel: 'Jue' },
  { value: 'friday', label: 'Viernes', shortLabel: 'Vie' },
  { value: 'saturday', label: 'Sábado', shortLabel: 'Sáb' },
  { value: 'sunday', label: 'Domingo', shortLabel: 'Dom' },
];
// #end-variable
