/* src/components/EmployeeRow/EmployeeRow.tsx */

import type { EmployeeResponse } from '../../services/employees';
import styles from './EmployeeRow.module.css';

// #interface EmployeeRowProps
interface EmployeeRowProps {
  employee: EmployeeResponse;
  onClick: (employee: EmployeeResponse) => void;
}
// #end-interface

// #component EmployeeRow
/**
 * Fila clickeable que muestra datos básicos de un empleado.
 * 
 * Muestra: avatar/iniciales, nombre, email, estado
 * Al clickear: abre modal de permisos
 */
const EmployeeRow = ({ employee, onClick }: EmployeeRowProps) => {
  // #function getInitials
  const getInitials = (firstName: string, lastName: string): string => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };
  // #end-function

  // #function getStateLabel
  const getStateLabel = (state: string): string => {
    const labels: Record<string, string> = {
      active: 'Activo',
      pending: 'Pendiente',
      suspended: 'Suspendido'
    };
    return labels[state] || state;
  };
  // #end-function

  // #function getStateIcon
  const getStateIcon = (state: string): string => {
    const icons: Record<string, string> = {
      active: '✅',
      pending: '⏳',
      suspended: '⛔'
    };
    return icons[state] || '❓';
  };
  // #end-function

  return (
    <div className={styles.row} onClick={() => onClick(employee)} role="button" tabIndex={0}>
      <div className={styles.avatar}>
        {getInitials(employee.firstName, employee.lastName)}
      </div>
      
      <div className={styles.info}>
        <div className={styles.name}>
          {employee.firstName} {employee.lastName}
        </div>
        <div className={styles.email}>
          {employee.email}
        </div>
      </div>

      <div className={styles.state}>
        <span className={styles.stateIcon}>{getStateIcon(employee.state)}</span>
        <span className={styles.stateLabel}>{getStateLabel(employee.state)}</span>
      </div>

      <div className={styles.action}>
        →
      </div>
    </div>
  );
};
// #end-component

export default EmployeeRow;
