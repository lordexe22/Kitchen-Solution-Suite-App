/* src/components/ScheduleRow/ScheduleRow.tsx */
// #section imports
import { useState } from 'react';
import type { BranchWithLocation, BranchSchedule, DayOfWeek } from '../../store/Branches.types';
import { DAYS_OF_WEEK } from '../../store/Branches.types';
import ScheduleDayEditor from '../ScheduleDayEditor/ScheduleDayEditor';
import styles from './ScheduleRow.module.css';
import '/src/styles/button.css';
// #end-section

// #interface CopiedSchedulesConfig
/**
 * Configuración copiada con el ID de la compañía para validar
 */
interface CopiedSchedulesConfig {
  companyId: number;
  schedules: BranchSchedule[];
}
// #end-interface

// #interface ScheduleRowProps
interface ScheduleRowProps {
  /** Sucursal */
  branch: BranchWithLocation;
  /** ID de la compañía (para validar copiar/pegar) */
  companyId: number;
  /** Horarios de la sucursal */
  schedules: BranchSchedule[];
  /** Callback al actualizar horarios */
  onUpdateSchedules: (branchId: number, schedules: BranchSchedule[]) => Promise<void>;
  /** Configuración copiada (estado global con companyId) */
  copiedConfig: CopiedSchedulesConfig | null;
  /** Callback para actualizar configuración copiada */
  onCopyConfig: (config: CopiedSchedulesConfig | null) => void;
  /** Indica si está cargando */
  isLoading?: boolean;
}
// #end-interface

// #component ScheduleRow
/**
 * Componente que muestra una tabla con los horarios de una sucursal.
 * Permite editar cada día individualmente.
 */
const ScheduleRow = ({ 
  branch, 
  companyId,
  schedules, 
  onUpdateSchedules,
  copiedConfig,
  onCopyConfig,
  isLoading 
}: ScheduleRowProps) => {
  const [editingDay, setEditingDay] = useState<DayOfWeek | null>(null);

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

  // #function handleCopyConfig
  /**
   * Copia la configuración de horarios (actualiza estado global con companyId).
   */
  const handleCopyConfig = () => {
    if (schedules.length === 0) {
      alert('No hay horarios configurados para copiar');
      return;
    }

    onCopyConfig({ companyId, schedules: [...schedules] });
    alert(`✓ Configuración copiada (${schedules.length} horarios)\n\nAhora puedes pegarla en cualquier otra sucursal de esta compañía.`);
  };
  // #end-function

  // #function handlePasteConfig
  /**
   * Pega la configuración copiada en esta sucursal.
   * Solo funciona si la config es de la misma compañía.
   */
  const handlePasteConfig = async () => {
    if (!copiedConfig || copiedConfig.schedules.length === 0) {
      alert('No hay configuración copiada');
      return;
    }

    // Validar que sea de la misma compañía
    if (copiedConfig.companyId !== companyId) {
      alert('No puedes pegar configuración de otra compañía');
      return;
    }

    if (!confirm(`¿Aplicar ${copiedConfig.schedules.length} horarios a esta sucursal?\n\nEsto reemplazará la configuración actual.`)) {
      return;
    }

    try {
      // Crear los nuevos horarios basados en la configuración copiada
      const newSchedules: BranchSchedule[] = copiedConfig.schedules.map(schedule => ({
        ...schedule,
        id: 0, // Temporal, el backend asignará IDs reales
        branchId: branch.id, // Cambiar al ID de la sucursal actual
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));

      await onUpdateSchedules(branch.id, newSchedules);
      alert('✓ Configuración aplicada exitosamente');
    } catch (error) {
      console.error('Error pasting schedules:', error);
      alert(error instanceof Error ? error.message : 'Error al aplicar horarios');
    }
  };
  // #end-function

  return (
    <div className={styles.container}>
      {/* #section Schedule table */}
      <div className={styles.scheduleTable}>
        {/* #section Header row - Nombres de días */}
        <div className={styles.headerRow}>
          {DAYS_OF_WEEK.map(day => (
            <div key={day.value} className={styles.headerCell}>
              {day.label}
            </div>
          ))}
        </div>
        {/* #end-section */}

        {/* #section Data row - Horarios */}
        <div className={styles.dataRow}>
          {DAYS_OF_WEEK.map(day => {
            const schedule = getScheduleForDay(day.value);
            const isClosed = !schedule || schedule.isClosed;
            
            return (
              <div
                key={day.value}
                className={`${styles.dayCell} ${isClosed ? styles.dayClosed : styles.dayOpen}`}
                onClick={() => !isLoading && handleCellClick(day.value)}
                title={`Click para editar ${day.label}`}
              >
                {formatSchedule(schedule)}
              </div>
            );
          })}
        </div>
        {/* #end-section */}
      </div>
      {/* #end-section */}

      {/* #section Footer with copy/paste buttons */}
      <div className={styles.footer}>
        <button
          className="btn-sec btn-sm"
          onClick={handleCopyConfig}
          disabled={isLoading || schedules.length === 0}
          title="Copiar configuración de esta sucursal"
        >
          📋 Copiar configuración
        </button>
        
        {copiedConfig && copiedConfig.schedules.length > 0 && copiedConfig.companyId === companyId && (
          <button
            className="btn-pri btn-sm"
            onClick={handlePasteConfig}
            disabled={isLoading}
            title="Pegar configuración copiada"
          >
            📥 Pegar configuración ({copiedConfig.schedules.length})
          </button>
        )}
      </div>
      {/* #end-section */}

      {/* Editor de día */}
      {editingDay && (
        <ScheduleDayEditor
          dayOfWeek={editingDay}
          schedule={getScheduleForDay(editingDay)}
          onSave={handleSaveSchedule}
          onCancel={() => setEditingDay(null)}
        />
      )}
    </div>
  );
};

export default ScheduleRow;
// #end-component