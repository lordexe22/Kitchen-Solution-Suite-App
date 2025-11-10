/* src/components/ScheduleDayEditor/ScheduleDayEditor.tsx */
// #section imports
import { useState, useEffect } from 'react';
import type { DayOfWeek, BranchSchedule } from '../../store/Branches.types';
import { DAYS_OF_WEEK } from '../../store/Branches.types';
import styles from './ScheduleDayEditor.module.css';
import '/src/styles/button.css';
import '/src/styles/modal.css';
// #end-section

// #interface ScheduleDayEditorProps
interface ScheduleDayEditorProps {
  /** Día de la semana a editar */
  dayOfWeek: DayOfWeek;
  /** Horario existente (si hay) */
  schedule?: BranchSchedule | null;
  /** Callback al guardar */
  onSave: (data: { openTime: string | null; closeTime: string | null; isClosed: boolean }) => void;
  /** Callback al cancelar */
  onCancel: () => void;
  /** Posición del popover */
  position?: { top: number; left: number };
}
// #end-interface

// #component ScheduleDayEditor
/**
 * Componente para editar el horario de un día específico.
 * Aparece como un popover sobre la celda clickeada.
 */
const ScheduleDayEditor = ({ dayOfWeek, schedule, onSave, onCancel, position }: ScheduleDayEditorProps) => {
  const dayLabel = DAYS_OF_WEEK.find(d => d.value === dayOfWeek)?.label || dayOfWeek;
  
  const [isClosed, setIsClosed] = useState(schedule?.isClosed ?? true);
  const [openTime, setOpenTime] = useState(schedule?.openTime || '09:00');
  const [closeTime, setCloseTime] = useState(schedule?.closeTime || '18:00');

  useEffect(() => {
    setIsClosed(schedule?.isClosed ?? true);
    setOpenTime(schedule?.openTime || '09:00');
    setCloseTime(schedule?.closeTime || '18:00');
  }, [schedule]);

  const handleSave = () => {
    onSave({
      openTime: isClosed ? null : openTime,
      closeTime: isClosed ? null : closeTime,
      isClosed
    });
  };

  const popoverStyle = position ? {
    position: 'fixed' as const,
    top: `${position.top}px`,
    left: `${position.left}px`,
    zIndex: 1000
  } : {};

  return (
    <>
      {/* Overlay para cerrar al hacer clic afuera */}
      <div className={styles.overlay} onClick={onCancel} />
      
      {/* Popover */}
      <div className={styles.popover} style={popoverStyle}>
        <div className={styles.header}>
          <h3 className={styles.title}>Editar {dayLabel}</h3>
        </div>
        
        <div className={styles.body}>
          {/* Radio: Abierto */}
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="status"
              checked={!isClosed}
              onChange={() => setIsClosed(false)}
            />
            <span>Abierto</span>
          </label>
          
          {/* Inputs de horario (solo si está abierto) */}
          {!isClosed && (
            <div className={styles.timeInputs}>
              <div className={styles.inputGroup}>
                <label>Desde:</label>
                <input
                  type="time"
                  value={openTime}
                  onChange={(e) => setOpenTime(e.target.value)}
                  className={styles.timeInput}
                />
              </div>
              
              <div className={styles.inputGroup}>
                <label>Hasta:</label>
                <input
                  type="time"
                  value={closeTime}
                  onChange={(e) => setCloseTime(e.target.value)}
                  className={styles.timeInput}
                />
              </div>
            </div>
          )}
          
          {/* Radio: Cerrado */}
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="status"
              checked={isClosed}
              onChange={() => setIsClosed(true)}
            />
            <span>Cerrado</span>
          </label>
        </div>
        
        <div className={styles.footer}>
          <button className="btn-sec btn-sm" onClick={onCancel}>
            Cancelar
          </button>
          <button className="btn-pri btn-sm" onClick={handleSave}>
            Guardar
          </button>
        </div>
      </div>
    </>
  );
};

export default ScheduleDayEditor;
// #end-component