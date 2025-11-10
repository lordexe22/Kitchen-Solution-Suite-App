/* src/components/ScheduleRow/ScheduleRow.tsx */
// #section imports
import { useState, useRef } from 'react';
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
  const [editingDay, setEditingDay] = useState<DayOfWeek | null>(null);
  const [editorPosition, setEditorPosition] = useState<{ top: number; left: number } | undefined>();
  const cellRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

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
    const cellElement = cellRefs.current[day];
    if (cellElement) {
      const rect = cellElement.getBoundingClientRect();
      setEditorPosition({
        top: rect.bottom + 8,
        left: rect.left
      });
    }
    setEditingDay(day);
  };
  // #end-function

  // #function handleSaveSchedule
  /**
   * Guarda el horario editado.
   */
  const handleSaveSchedule = async (data: { openTime: string | null; closeTime: string | null; isClosed: boolean }) => {
    if (!editingDay) return;

    // Crear una copia de los horarios actuales
    const updatedSchedules = [...schedules];
    
    // Buscar si ya existe un horario para este día
    const existingIndex = updatedSchedules.findIndex(s => s.dayOfWeek === editingDay);
    
    if (existingIndex >= 0) {
      // Actualizar existente
      updatedSchedules[existingIndex] = {
        ...updatedSchedules[existingIndex],
        openTime: data.openTime,
        closeTime: data.closeTime,
        isClosed: data.isClosed
      };
    } else {
      // Crear nuevo
      updatedSchedules.push({
        id: 0, // Temporal, el backend asignará el ID real
        branchId: branch.id,
        dayOfWeek: editingDay,
        openTime: data.openTime,
        closeTime: data.closeTime,
        isClosed: data.isClosed,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
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
    if (schedules.length === 0) {
      alert('No hay horarios configurados para aplicar');
      return;
    }

    if (confirm('¿Aplicar estos horarios a todas las sucursales de la empresa?\n\nEsto reemplazará los horarios existentes.')) {
      await onApplyToAll(branch.id);
    }
  };
  // #end-function

  return (
    <>
      <div className={styles.row}>
        {/* Columna: Nombre de sucursal */}
        <div className={styles.branchInfo}>
          <span className={styles.branchName}>
            📍 {branch.name || `Sucursal #${branch.id}`}
          </span>
          {branch.location && (
            <span className={styles.branchLocation}>
              {branch.location.city}, {branch.location.state}
            </span>
          )}
        </div>

        {/* Columnas: Días de la semana */}
        {DAYS_OF_WEEK.map(day => {
          const schedule = getScheduleForDay(day.value);
          const isClosed = !schedule || schedule.isClosed;
          
          return (
            <div
              key={day.value}
              ref={el => { 
                if (el) cellRefs.current[day.value] = el;
              }}
              className={`${styles.dayCell} ${isClosed ? styles.dayClosed : styles.dayOpen}`}
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

      {/* Editor de día */}
      {editingDay && (
        <ScheduleDayEditor
          dayOfWeek={editingDay}
          schedule={getScheduleForDay(editingDay)}
          onSave={handleSaveSchedule}
          onCancel={() => setEditingDay(null)}
          position={editorPosition}
        />
      )}
    </>
  );
};

export default ScheduleRow;
// #end-component