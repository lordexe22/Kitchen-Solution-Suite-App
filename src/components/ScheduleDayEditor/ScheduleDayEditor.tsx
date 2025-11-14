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
}
// #end-interface

// #component ScheduleDayEditor
/**
 * Componente para editar el horario de un día específico.
 * Aparece como un modal centrado en la pantalla.
 */
const ScheduleDayEditor = ({ dayOfWeek, schedule, onSave, onCancel }: ScheduleDayEditorProps) => {
  const dayLabel = DAYS_OF_WEEK.find(d => d.value === dayOfWeek)?.label || dayOfWeek;
  
  // #state [isClosed, setIsClosed]
  const [isClosed, setIsClosed] = useState(schedule?.isClosed ?? true);
  // #end-state

  // #state [openTime, setOpenTime]
  const [openTime, setOpenTime] = useState(schedule?.openTime || '09:00');
  // #end-state

  // #state [closeTime, setCloseTime]
  const [closeTime, setCloseTime] = useState(schedule?.closeTime || '18:00');
  // #end-state

  // #effect - Update state when schedule changes
  useEffect(() => {
    setIsClosed(schedule?.isClosed ?? true);
    setOpenTime(schedule?.openTime || '09:00');
    setCloseTime(schedule?.closeTime || '18:00');
  }, [schedule]);
  // #end-effect

  // #event handleSave
  const handleSave = () => {
    onSave({
      openTime: isClosed ? null : openTime,
      closeTime: isClosed ? null : closeTime,
      isClosed
    });
  };
  // #end-event

  // #section return
  return (
    <>
      {/* Overlay */}
      <div className="modal-overlay" onClick={onCancel}>
        {/* Modal Container */}
        <div 
          className={styles.modalContainer} 
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={styles.header}>
            <h3 className={styles.title}>Editar {dayLabel}</h3>
            <button 
              className={styles.closeButton}
              onClick={onCancel}
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>
          
          {/* Body */}
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
          
          {/* Footer */}
          <div className={styles.footer}>
            <button className="btn-sec btn-sm" onClick={onCancel}>
              Cancelar
            </button>
            <button className="btn-pri btn-sm" onClick={handleSave}>
              Guardar
            </button>
          </div>
        </div>
      </div>
    </>
  );
  // #end-section
};

export default ScheduleDayEditor;
// #end-component