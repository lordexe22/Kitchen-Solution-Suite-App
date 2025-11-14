/* src/components/ScheduleRow/ScheduleRow.tsx */
// #section imports
import { useState } from 'react';
import type { BranchWithLocation, BranchSchedule, DayOfWeek } from '../../store/Branches.types';
import { DAYS_OF_WEEK } from '../../store/Branches.types';
import ScheduleDayEditor from '../ScheduleDayEditor/ScheduleDayEditor';
import styles from './ScheduleRow.module.css';
import '/src/styles/button.css';
// #end-section
// #interface ScheduleRowProps
interface ScheduleRowProps {
  /** Sucursal */
  branch: BranchWithLocation;
  /** Horarios de la sucursal */
  schedules: BranchSchedule[];
  /** Callback al actualizar horarios */
  onUpdateSchedules: (branchId: number, schedules: BranchSchedule[]) => Promise<void>;
  /** Callback al aplicar a todas */
  onApplyToAll: (branchId: number) => Promise<void>;
  /** Indica si está cargando */
  isLoading?: boolean;
}
// #end-interface
// #component ScheduleRow
/**
 * Componente que muestra una fila con los horarios de una sucursal.
 * Permite editar cada día individualmente.
 */
const ScheduleRow = ({ branch, schedules, onUpdateSchedules, onApplyToAll, isLoading }: ScheduleRowProps) => {
  // #state [editingDay, setEditingDay]
  const [editingDay, setEditingDay] = useState<DayOfWeek | null>(null);
  // #end-state
  // #function getScheduleForDay
  /**
   * Obtiene el horario de un día específico.
   */
  const getScheduleForDay = (day: DayOfWeek): BranchSchedule | undefined => {
    return schedules.find(s => s.dayOfWeek === day);
  };
  // #end-function
  // #function formatSchedule
  /**
   * Formatea el horario para mostrar en la celda.
   */
  const formatSchedule = (schedule?: BranchSchedule): string => {
    if (!schedule || schedule.isClosed) {
      return 'Cerrado';
    }
    return `${schedule.openTime}-${schedule.closeTime}`;
  };
  // #end-function
  // #function handleCellClick
  /**
   * Maneja el click en una celda de día.
   */
  const handleCellClick = (day: DayOfWeek) => {
    setEditingDay(day);
  };
  // #end-function
  // #function handleSaveSchedule
  /**
   * Guarda el horario editado.
   */
  const handleSaveSchedule = async (data: { openTime: string | null; closeTime: string | null; isClosed: boolean }) => {
    const updatedSchedules = schedules.map(s => 
      s.dayOfWeek === editingDay
        ? { ...s, ...data }
        : s
    );

    // Si no existe un schedule para este día, crearlo
    if (!schedules.find(s => s.dayOfWeek === editingDay)) {
      const now = new Date().toISOString();
      updatedSchedules.push({
        id: 0, // Temporal, el backend asignará el ID
        branchId: branch.id,
        dayOfWeek: editingDay!,
        createdAt: now,
        updatedAt: now,
        ...data
      });
    }

    await onUpdateSchedules(branch.id, updatedSchedules);
    setEditingDay(null);
  };
  // #end-function
  // #function handleApplyToAll
  /**
   * Aplica los horarios de esta sucursal a todas.
   */
  const handleApplyToAll = async () => {
    if (confirm('¿Aplicar estos horarios a todas las sucursales de la compañía?')) {
      await onApplyToAll(branch.id);
    }
  };
  // #end-function
  // #section return
  return (
    <>
      <div className={styles.scheduleRow}>
        {/* Columna: Nombre de sucursal */}
        <div className={styles.branchName}>
          {branch.name || `Sucursal ${branch.id}`}
        </div>

        {/* Columnas: Días de la semana */}
        {DAYS_OF_WEEK.map(day => {
          const schedule = getScheduleForDay(day.value);
          console.log(day.value, schedule);
          return (
            <div
              key={day.value}
              className={`${styles.dayCell} ${!schedule || schedule.isClosed ? styles.dayClosed : styles.dayOpen}`}
              onClick={() => !isLoading && handleCellClick(day.value)}
              title={`Click para editar ${day.label}`}
            >
              {formatSchedule(schedule)}
            </div>
          );
        })}

        {/* Columna: Acciones */}
        <div className={styles.actions}>
          <button
            className="btn-sec btn-xs"
            onClick={handleApplyToAll}
            disabled={isLoading || schedules.length === 0}
            title="Aplicar estos horarios a todas las sucursales"
          >
            📢 Aplicar a todas
          </button>
        </div>
      </div>

      {/* Editor de día - Modal centrado */}
      {editingDay && (
        <ScheduleDayEditor
          dayOfWeek={editingDay}
          schedule={getScheduleForDay(editingDay)}
          onSave={handleSaveSchedule}
          onCancel={() => setEditingDay(null)}
        />
      )}
    </>
  );
  // #end-section
};
export default ScheduleRow;
// #end-component