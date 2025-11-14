// #section imports
import type { Company } from '../../store/Companies.types';
import type { ReactNode } from 'react';
// #end-section
// #interface CompanyAccordionProps
/**
 * Props for CompanyAccordion component.
 * 
 * @property {Company} company - Company data 
 * @property {ReactNode} children - Component children
 * @property {() => void} onToggle - Optional callback for expand/collapse
 * @property {() => void} onEdit - Optional callback for edit company
 * @property {() => void} onDelete - Optional callback for delete company
 */
export interface CompanyAccordionProps {
  company: Company
  children?: ReactNode
  onEdit?: () => void
  onDelete?: () => void
  onToggle?: () => void
}
// #end-interface