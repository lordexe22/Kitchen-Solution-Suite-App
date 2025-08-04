/* src\modules\companySchedule\companySchedule.hooks.ts */

// #section Imports
import { useState, useCallback } from 'react';
import type { WeeklySchedule, DayOfWeek } from './companySchedule.t';
import { 
  validateWeeklySchedule,
  updateCompanySchedule 
} from './companySchedule.utils';
// #end-section
// #hook useCompanyScheduleController
export const useCompanyScheduleController = (companyId: string) => {
  // #state [weeklySchedule, setWeeklySchedule] - weekly schedule state
  const initialSchedule: WeeklySchedule = {
    monday: { isClosed: false, turns: [] },
    tuesday: { isClosed: false, turns: [] },
    wednesday: { isClosed: false, turns: [] },
    thursday: { isClosed: false, turns: [] },
    friday: { isClosed: false, turns: [] },
    saturday: { isClosed: false, turns: [] },
    sunday: { isClosed: false, turns: [] },
  };

  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>(initialSchedule);
  // #end-state
  // #function toggleDayClosed(day) - toggle the isClosed state for a day of the week 
  const toggleDayClosed = (day: DayOfWeek) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        isClosed: !prev[day].isClosed,
      },
    }));
  };
  // #end-function
  // #function addTurnToDay(day) - add a new turn on a day of the week
    const addTurnToDay = (day: DayOfWeek) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        turns: [
          ...prev[day].turns,
          { start: '', end: '' },
        ],
      },
    }));
  };
  // #end-function
  // #event handleAddTurn - Add a new turn in one day of the week
  const handleAddTurn = (day: DayOfWeek) => {
    addTurnToDay(day);
  };
  // #end-event
  // #event handleRemoveTurn - Remove the turn attached whit the delete turn button
  const handleRemoveTurn = useCallback((day: DayOfWeek, index: number) => {
    setWeeklySchedule((prevSchedule) => {
      const updatedTurns = [...prevSchedule[day].turns];
      updatedTurns.splice(index, 1);

      return {
        ...prevSchedule,
        [day]: {
          ...prevSchedule[day],
          turns: updatedTurns,
        },
      };
    });
  }, []);
  // #end-event
  // #event handleTurnInputChange - Maneja el submit completo del formulario
  const handleTurnInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target; // id esperado: start-monday-0 o end-tuesday-1
    const [field, day, indexStr] = id.split('-');
    const index = Number(indexStr);

    setWeeklySchedule(prev => {
      const updatedTurns = [...prev[day as DayOfWeek].turns];
      updatedTurns[index] = {
        ...updatedTurns[index],
        [field]: value,
      };
      return {
        ...prev,
        [day]: {
          ...prev[day as DayOfWeek],
          turns: updatedTurns,
        }
      };
    });
  }, []);
  // #end-event
  // #event handleSubmit - Maneja el submit completo del formulario
  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateWeeklySchedule(weeklySchedule)) {
      console.error('La validación falló, no se envía el formulario.');
      return;
    }
    try {
      await updateCompanySchedule(companyId, weeklySchedule);
      console.log('Configuración semanal enviada correctamente');
    } catch (error) {
      console.error('Error al enviar configuración semanal:', error);
    }
  }, [weeklySchedule, companyId]);
  // #end-event
  // #section return
  return {
    weeklySchedule,
    addTurnToDay, 
    toggleDayClosed,
    handleAddTurn,
    handleRemoveTurn,
    handleTurnInputChange,
    handleSubmit
  };
  // #end-section
};
// #end-hook
